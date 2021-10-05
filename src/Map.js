import React, { Component } from 'react';
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps';

import PlacesAutocomplete, {
  geocodeByAddress,
  geocodeByLatLng,
  getLatLng
} from 'react-google-places-autocomplete';

const Map = (props) => {
  const [address, setAddress] = React.useState(null);
  const [formattedAddress, setFormattedAddress] = React.useState(null);
  const defaultCenter = {lat: 30.0442086, lng: 31.2340953}
  const [lat, setLat] = React.useState(null);
  const [lng, setLng] = React.useState(null);
  const [map, setMap] = React.useState(null);

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        if (position && position.coords) {
          const { longitude, latitude } = position.coords;
          setLng(longitude);
          setLat(latitude);
        }
      });
    }
  }, []);

  React.useEffect(() => {
    if (lat && lng && !address) {
      geocodeByLatLng({ lat, lng })
        .then(results => {
          const label = results[0].formatted_address;
          setFormattedAddress(label);
          console.log("revere geocode", { results: results[0] });
        })
        .catch(error => console.error("DEBUG: ERROR", { error }));
    }else{
      console.log("DEBUG: condition not met");
    }
  },[lat,lng, address]);

  React.useEffect(() => {
    console.log("DEBUG", { address });
    if (address && address.label) {
      console.log("DEBUG there is address label", { address });
      geocodeByAddress(address.label)
        .then((results) => getLatLng(results[0]))
        .then(({ lat, lng }) => {
          setLng(lng);
          setLat(lat);
        })
        .catch((error) => console.error(error));
    }
  }, [address?.label, address]);

    const GoogleMapExample = withGoogleMap(props => (
      <GoogleMap defaultCenter={defaultCenter} defaultZoom={15} center={{lat, lng}}>
        <Marker
          key={"marker-one"}
          position={{lat, lng}}
          onClick={() => {}}
        >
        </Marker>
      </GoogleMap>
    ));

    return (
      <div>
        <PlacesAutocomplete
          autocompletionRequest={{
            componentRestrictions: {
              country: ["eg"],
            },
          }}
          selectProps={{
            value: address?.label,
            onChange: setAddress,
          }}
          apiOptions={{ language: 'ar', region: 'eg' }}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading
          }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: 'Search Places ...',
                  className: 'location-search-input'
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style
                      })}
                      key={suggestion.placeId}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
        <GoogleMapExample
          containerElement={<div style={{ height: `40vh`, width: '100vw' }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      <p>{JSON.stringify(address, null, 4)}</p>
      <ul>
        <li>latitude: {lat}</li>
        <li>longitude: {lng}</li>
        <li>formatted Address: {formattedAddress}</li>
      </ul>
      </div>
    );
}

export default Map;

