import React, { useState, useEffect, useRef } from 'react';
import './App.scss';
import { Grid, TextField } from '@mui/material';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
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
    onPlaceSelected: (place) => {
      if(!place.geometry || !place.geometry.location){
        console.log('No Place detail')
        return;
      }
      if(mapRef.current){
        mapRef.current.setCenter(place.geometry.location)
        setLocation(place.geometry.location)
        mapRef.current.setZoom(17)
        setPlace(place);
      }
    }
  });

  useEffect(() => {
    console.log('onUseEffect', { place })
    if(place){
      console.log('place useEffect', { place});
      map.setCenter(place.geometry.location)
      map.setZoom(17);
    }
  }, [place, map]);

  function onLoad(map){
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    map.setCenter(center)
    mapRef.current = map;
    autocompleteRef.current.bindTo("bounds", map);
    setMap(map)
  }

  function onUnmount(){
    setMap(null)
  }

  return (
    <Grid direction="column" container>
      <TextField inputRef={ref} fullWidth label="Search data" variant="outlined" />
      <Grid item flex={1} className="map-container">
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={17}
            ref={mapRef}
            options={{
              mapTypeControl: false
            }}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            <Marker position={location} />
          </GoogleMap>
        )}
      </Grid>
    </Grid>
  );
}

export default App;
