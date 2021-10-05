import React from "react";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import GoogleMap from "google-map-react";

export const GoogleMapsAPI = "AIzaSyDsVzu76KgWa2-5CrQ3Su9r3mwBl0ak-Wc";
const AnyReactComponent = ({ text }) => <div>{text}</div>;


const App = () => {
  const [address, setAddress] = React.useState(null);
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

  return (
    <div>
      {map && (
      <GooglePlacesAutocomplete
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
        />
      )}
      <div style={{ width: "100vw", height: "30vh" }}>
        {!isNaN(lat) && !isNaN(lng) && (
          <GoogleMap
            defaultZoom={8}
            defaultCenter={defaultCenter}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => setMap(map)}
          
          
            //bootstrapURLKeys={{key: GoogleMapsAPI}}
            // zoom={this.props.zoom}
            // onBoundsChange={this._onBoundsChange}
            // onChildClick={this._onChildClick}
            // onChildMouseEnter={this._onChildMouseEnter}
            // onChildMouseLeave={this._onChildMouseLeave}
            // margin={[K_MARGIN_TOP, K_MARGIN_RIGHT, K_MARGIN_BOTTOM, K_MARGIN_LEFT]}
            // hoverDistance={K_HOVER_DISTANCE}
            // distanceToMouse={this._distanceToMouse}
          >
            <AnyReactComponent
            lat={lat}
            lng={lng}
            text="My Address"
          />
          </GoogleMap>
        )}
      </div>
      <p>{JSON.stringify(address, null, 4)}</p>
      <ul>
        <li>latitude: {lat} {typeof lat}</li>
        <li>longitude: {lng} {typeof lng}</li>
      </ul>
    </div>
  );
};

export default App;
