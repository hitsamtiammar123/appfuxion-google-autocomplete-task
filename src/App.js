import React, { useState, useEffect, useRef, useMemo } from 'react';
import './App.scss';
import { Grid, TextField, Button, Dialog, DialogContentText, DialogTitle, DialogContent, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { usePlacesWidget } from "react-google-autocomplete";
import { Provider, useSelector, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { setSearchResult } from './redux/actions/map-search';
import { addPlace, removePlace as removePlaceAction } from './redux/actions/map-save-place';
import store, { persistor } from './redux';

/**
 *
 * This is my own api key, Once the I got information whether I rejest or not then I'll revoke this key.
 * So please, don't use this key without my knowledge
 */
const API_KEY = 'AIzaSyClX6Ku7KcHT9cIdGvK3rMwZY1_8hzto2A';
const containerStyle = {
  width: '100%',
  height: '800px'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

function Body(){
  const [map, setMap] = useState(null)
  const [place, setPlace] = useState(null);
  const [libraries] = useState(['places']);
  const [location, setLocation] = useState(center);
  const [isShowDialog, setShowDialog] = useState(false);
  const [isDisplayInfoWindow, setIsDisplayInfoWindow] = useState(false);
  const savedPlaces = useSelector((states) => states.mapsaveplace.savedPlaces);
  const dispatch = useDispatch();
  const mapRef = useRef(null);

  const checkLocation = useMemo(() => {
    if(place){
      return savedPlaces.findIndex((item) => item.id === place.id) !== -1;
    }
    return false;
  }, [place, savedPlaces])

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY,
    libraries: libraries,
    version: ['weekly'],
  })
  const { ref, autocompleteRef } = usePlacesWidget({
    apiKey: API_KEY,
    options: {
      strictBounds: false,
      types: ["establishment"],
    },
    onPlaceSelected: onPlaceSelected
  });

  useEffect(() => {
    if(place){
      map.setCenter(place.location)
      map.setZoom(17);
    }
  }, [place, map]);

  function setMarkerLocation(placeObj, locationObj){
    setIsDisplayInfoWindow(false);
    // const location = place.geometry.location;
    const locationObject = {
      lat: locationObj.lat,
      lng: locationObj.lng
    }
    if(mapRef.current){
      mapRef.current.setCenter(locationObject)
      mapRef.current.setZoom(17)
    }
    setLocation(locationObject)
    setPlace(placeObj);
  }


  function onPlaceSelected(place){
    if(!place.geometry || !place.geometry.location){
      console.log('No Place detail')
      return;
    }
    const placeObj = generatePlaceObj(place);
    setMarkerLocation(placeObj,{
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    })
    dispatch(
      setSearchResult(placeObj)
    )
  }

  function onLoad(map){
    map.setCenter(center)
    mapRef.current = map;
    autocompleteRef.current.bindTo("bounds", map);
    setMap(map)
  }

  function onUnmount(){
    setMap(null)
  }

  function removePlace(id){
    dispatch(
      removePlaceAction({
        id
      })
    )
  }

  function generatePlaceObj(place){
    return {
      id: place.place_id,
      formatted_address: place.formatted_address,
      location: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      }
    }
  }

  function savePlace(){
    if(checkLocation){
      removePlace(place.id);
      return;
    }
    dispatch(
      addPlace(place)
    )
  }

  function onCloseItemButtonClicked(item){
    setShowDialog(false);
    setTimeout(() => removePlace(item.id), 500)
  }

  function onItemClicked(item){
    setShowDialog(false);
    setTimeout(() => {
      setMarkerLocation(item,{
        lat: item.location.lat,
        lng: item.location.lng,
      })
    }, 300);
  }

  return (
    <Grid direction="column" justifyContent="flex-start" container>
    <Grid className="map-input-container" container item direction="row">
      <TextField variant="standard" className="map-input-field" inputRef={ref} label="Search data" />
      <Button onClick={() => setShowDialog(true)} className="drawer-button" variant="outlined">
        <FmdGoodIcon/>
      </Button>
    </Grid>
    <Grid item flex={1} className="map-container">
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          onClick={() => isDisplayInfoWindow && setIsDisplayInfoWindow(false)}
          ref={mapRef}
          options={{
            mapTypeControl: false
          }}
          inputProps={{
            className: 'map-input'
          }}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          <Marker onClick={() => setIsDisplayInfoWindow(!isDisplayInfoWindow)} position={location}>
            {isDisplayInfoWindow && (
              <InfoWindow onCloseClick={() => setIsDisplayInfoWindow(false)}>
                <Button onClick={savePlace} variant="contained" color={checkLocation ? 'error' : 'primary'}>{checkLocation ? 'Remove Location' : 'Save Location'}</Button>
              </InfoWindow>
            )}
          </Marker>
        </GoogleMap>
      )}
    </Grid>
    <Dialog maxWidth="sm" open={isShowDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle>Saved Locations</DialogTitle>
        <DialogContent >
        <Grid className="list-container" container justifyContent="center">
          <List>
            {savedPlaces.length ? savedPlaces.map(item => (
              <ListItem key={item.id}>
                <Button onClick={() => onCloseItemButtonClicked(item)} className="error-btn">
                  <CloseOutlinedIcon color="error" />
                </Button>
                <ListItemButton onClick={() => onItemClicked(item)}>
                  <ListItemText className="mr">{item.formatted_address}</ListItemText>
                  <ArrowForwardOutlinedIcon />
                </ListItemButton>
              </ListItem>
            )): (
              <Grid container justifyContent="center">
                <DialogContentText>You haven't saved any places</DialogContentText>
              </Grid>
            )}
          </List>
        </Grid>
      </DialogContent>
    </Dialog>
  </Grid>
  )
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Body />
      </PersistGate>
    </Provider>
  );
}

export default App;
