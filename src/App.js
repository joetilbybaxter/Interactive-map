import React, { useEffect } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { Dropdown, Selection } from "react-dropdown-now";
import "./App.css";
import snazzyMapStyle from "./snazzyMapStyle";

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};
const center = {
  lat: 53.8008,
  lng: 1.5491,
};
const options = {
  styles: snazzyMapStyle,
  disableDefaultUI: true,
  zoomControl: true,
  disableDoubleClickZoom: true,
};
const dropDownOptions = [
  "GMT/UTC",
  "ECT",
  "EET/ART",
  "EAT",
  "MET",
  "NET",
  "PLT",
  "IST",
  "BST",
  "VST",
  "CTT",
  "JST",
  "ACT",
  "AET",
  "SST",
  "NST",
  "MIT",
  "HST",
  "AST",
  "PST",
  "PNT",
  "MST/CST",
  "EST/IET",
  "PRT",
  "CNT",
  "AGT/BET",
  "CAT",
];

// useEffect(() => {
//   if(Time.now){}
// })

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBQOpB6VIAwchN9psR1rUiZOr53fuzHRys",
  });

  if (loadError) return "Error loading Map";
  if (!isLoaded) return "Loading Map";
  return (
    <div>
      <h1>Joe's Map</h1>
      <Dropdown
        placeholder="Select timezone"
        className="timezone"
        options={dropDownOptions}
        value=""
        onChange={(value) => console.log(value)}
      ></Dropdown>
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onClick={(ev) => {
          const currentLat = ev.latLng.lat();
          const currentLng = ev.latLng.lng();
          console.log("latitude = ", ev.latLng.lat());
          console.log("longitude = ", ev.latLng.lng());
          fetch(
            "https://api.sunrise-sunset.org/json?lat=" +
              { currentLat } +
              "&lng=" +
              { currentLng }
          )
            .then((response) => response.json())
            .then(function (response) {
              var sunrise = response.results.sunrise;
              var sunset = response.results.sunset;
              var currentHour = new Date().getUTCHours();

              const convertTime12to24 = (time12h) => {
                const [time, modifier] = time12h.split(" ");
                let [hours] = time.split(":");
                if (hours === "12") {
                  hours = "00";
                }
                if (modifier === "PM") {
                  hours = parseInt(hours, 10) + 12;
                }
                return `${hours}`;
              };
              var convertedSunrise = convertTime12to24(sunrise);
              var convertedSunset = convertTime12to24(sunset);
              if (
                currentHour > convertedSunrise &&
                currentHour < convertedSunset
              ) {
                return console.log("DAYTIME");
              } else {
                return console.log("NIGHT TIME");
              }
            });
        }}
      ></GoogleMap>
    </div>
  );
}

export default App;
