import React, { useState, useEffect, useRef } from 'react';
import './App.scss';
import { Grid, TextField, Button, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemButton, ListItemText, DialogContentText } from '@mui/material';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { usePlacesWidget } from "react-google-autocomplete";

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

function App() {
  const [map, setMap] = useState(null)
  const [place, setPlace] = useState(null);
  const [libraries] = useState(['places']);
  const [location, setLocation] = useState(center);
  const [isShowDialog, setShowDialog] = useState(false);
  const [isDisplayInfoWindow, setIsDisplayInfoWindow] = useState(false);
  const mapRef = useRef(null);

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
    console.log('onUseEffect', { place })
    if(place){
      console.log('place useEffect', { place});
      map.setCenter(place.geometry.location)
      map.setZoom(17);
    }
  }, [place, map]);


  function onPlaceSelected(place){
    if(!place.geometry || !place.geometry.location){
      console.log('No Place detail')
      return;
    }
    if(mapRef.current){
      mapRef.current.setCenter(place.geometry.location)
      mapRef.current.setZoom(17)
    }
    setLocation(place.geometry.location)
    setPlace(place);
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

  console.log('autocomplete', autocompleteRef.current)

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
                  <Button variant="contained" color="primary">Save Location</Button>
                </InfoWindow>
              )}
            </Marker>
          </GoogleMap>
        )}
      </Grid>
      <Dialog fullWidth maxWidth="sm" open={isShowDialog} onClose={() => setShowDialog(false)}>
          <DialogTitle>Saved Locations</DialogTitle>
          <DialogContent >
          <Grid fullWidth container justifyContent="center">
            <List>
              <ListItem>
                <ListItemButton>
                  <ListItemText>Xconnect - Rua 16 - Vila Velha, Fortaleza - State of Ceará, Brazil</ListItemText>
                  <ArrowForwardOutlinedIcon />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton>
                  <ListItemText>Gambiarra ventiladores - Rua do Poente - Barra do Ceará, Fortaleza - State of Ceará, Brazi</ListItemText>
                  <ArrowForwardOutlinedIcon />
                </ListItemButton>
              </ListItem>
              {Array.from(Array(20)).map(((i, index) => (
                <ListItem key={index}>
                  <ListItemButton>
                    <ListItemText>Grand Indonesia, Jalan M.H. Thamrin, Kebon Melati, Central Jakarta City, Jakarta, Indonesia</ListItemText>
                    <ArrowForwardOutlinedIcon />
                  </ListItemButton>
                </ListItem>
              )))}
            </List>
          </Grid>
        </DialogContent>
      </Dialog>
    </Grid>
  );
}

export default App;
