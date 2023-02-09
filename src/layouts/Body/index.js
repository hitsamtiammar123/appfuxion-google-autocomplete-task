import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Grid, Button } from '@mui/material';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { usePlacesWidget } from 'react-google-autocomplete';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchResult } from 'src/store/actions/map-search';
import { Header } from 'layouts';
import { API_KEY } from 'constants';
import { addPlace, removePlace as removePlaceAction } from 'src/store/actions/map-save-place';
import { SavedLocation } from 'dialogs';

const containerStyle = {
  width: '100%',
  height: '800px',
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

export default function Body() {
  const [map, setMap] = useState(null);
  const [place, setPlace] = useState(null);
  const [libraries] = useState(['places']);
  const [location, setLocation] = useState(center);
  const [isShowDialog, setShowDialog] = useState(false);
  const [isDisplayInfoWindow, setIsDisplayInfoWindow] = useState(false);
  const savedPlaces = useSelector((states) => states.mapsaveplace.savedPlaces);
  const dispatch = useDispatch();
  const mapRef = useRef(null);

  const checkLocation = useMemo(() => {
    if (place) {
      return savedPlaces.findIndex((item) => item.id === place.id) !== -1;
    }
    return false;
  }, [place, savedPlaces]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY,
    libraries: libraries,
    version: ['weekly'],
  });
  const { ref, autocompleteRef } = usePlacesWidget({
    apiKey: API_KEY,
    options: {
      strictBounds: false,
      types: ['establishment1'],
    },
    onPlaceSelected: onPlaceSelected,
  });

  useEffect(() => {
    if (place) {
      map.setCenter(place.location);
      map.setZoom(17);
    }
    if (autocompleteRef.current) {
      const autocompleteElem = autocompleteRef.current;
      const placeChangedEvent = autocompleteElem.__e3_.place_changed;
      if (Object.keys(placeChangedEvent).length === 0) {
        autocompleteElem.addListener(onPlaceSelected);
      }
    }
    console.log({ autocompleteRef });
  }, [place, map]);

  function setMarkerLocation(placeObj, locationObj) {
    setIsDisplayInfoWindow(false);
    const locationObject = {
      lat: locationObj.lat,
      lng: locationObj.lng,
    };
    if (mapRef.current) {
      mapRef.current.setCenter(locationObject);
      mapRef.current.setZoom(17);
    }
    setLocation(locationObject);
    setPlace(placeObj);
  }

  function onPlaceSelected(place) {
    if (!place.geometry || !place.geometry.location) {
      console.log('No Place detail');
      return;
    }
    const placeObj = generatePlaceObj(place);
    setMarkerLocation(placeObj, {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
    dispatch(setSearchResult(placeObj));
  }

  function onLoad(map) {
    map.setCenter(center);
    mapRef.current = map;
    autocompleteRef.current.bindTo('bounds', map);
    setMap(map);
  }

  function onUnmount() {
    setMap(null);
  }

  function removePlace(id) {
    dispatch(
      removePlaceAction({
        id,
      })
    );
  }

  function generatePlaceObj(place) {
    return {
      id: place.place_id,
      formatted_address: place.formatted_address,
      location: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      },
    };
  }

  function savePlace() {
    if (checkLocation) {
      removePlace(place.id);
      return;
    }
    dispatch(addPlace(place));
  }

  function onCloseItemButtonClicked(item) {
    setShowDialog(false);
    setTimeout(() => removePlace(item.id), 500);
  }

  function onItemClicked(item) {
    setShowDialog(false);
    setTimeout(() => {
      setMarkerLocation(item, {
        lat: item.location.lat,
        lng: item.location.lng,
      });
    }, 300);
  }

  function renderMap() {
    return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onClick={() => isDisplayInfoWindow && setIsDisplayInfoWindow(false)}
        ref={mapRef}
        options={{
          mapTypeControl: false,
        }}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Marker onClick={() => setIsDisplayInfoWindow(!isDisplayInfoWindow)} position={location}>
          {isDisplayInfoWindow && (
            <InfoWindow onCloseClick={() => setIsDisplayInfoWindow(false)}>
              <Button
                onClick={savePlace}
                variant="contained"
                color={checkLocation ? 'error' : 'primary'}
              >
                {checkLocation ? 'Remove Location' : 'Save Location'}
              </Button>
            </InfoWindow>
          )}
        </Marker>
      </GoogleMap>
    );
  }

  return (
    <Grid direction="column" justifyContent="flex-start" container>
      <Header onIconButtonClick={() => setShowDialog(true)} inputRef={ref} />
      <Grid item flex={1} className="map-container">
        {isLoaded && renderMap()}
      </Grid>
      <SavedLocation
        onCloseItemButtonClicked={onCloseItemButtonClicked}
        onItemClicked={onItemClicked}
        isShowDialog={isShowDialog}
        onClose={() => setShowDialog(false)}
        savedPlaces={savedPlaces}
      />
    </Grid>
  );
}
