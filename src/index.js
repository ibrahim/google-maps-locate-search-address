import React, { Component } from 'react';
import { render } from 'react-dom';
import { withScriptjs } from "react-google-maps";
import Map from './Map';


const App = () => {
  const MapLoader = withScriptjs(Map);

  return (
    <MapLoader
      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDsVzu76KgWa2-5CrQ3Su9r3mwBl0ak-Wc&libraries=places"
      loadingElement={<div style={{ height: `100%` }} />}
    />
  );
};

render(<App />, document.getElementById('root'));

