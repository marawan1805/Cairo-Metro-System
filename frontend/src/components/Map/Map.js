import React, { useRef, useEffect, useState, createContext } from "react";
import mapboxgl, { Popup } from "mapbox-gl";
import "./Map.css";
import Menu from "../Menu";
import ThemeSelector from "../ThemeSelector";
import Header from "../Header/Header";
import LocationCards from "./LocationCards";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWFyYXdhbjE4MDUiLCJhIjoiY2xoN2tlaXc2MGg4MDNlczZlNjl1cGlvbiJ9.z1IvnyHR-Uo83BIeuuIZBQ";

export const MapContext = createContext();

const Map = () => {
  const mapContainer = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [startStation, setStartStation] = useState(null);
  const [endStation, setEndStation] = useState(null);
  const [mapStyle, setMapStyle] = useState(
    "mapbox://styles/marawan1805/clh7miglu00vh01pg1vr50erd"
  );

  // Hover popup
  let hoverPopup = null;
  // Click popup
  let clickPopup = null;

  const [bookingTicket, setBookingTicket] = useState(false);

  const handleBookTicketClick = (feature) => {
    setEndStation(feature);
    setBookingTicket(true);
    if (clickPopup) {
      clickPopup.remove();
    }
  };

  const handleStationClick = (feature) => {
    if (bookingTicket) {
      // If this is the starting station, do not create a popup
      if (startStation && startStation.properties.stop_id === feature.properties.stop_id) {
        return;
      }
      setStartStation(feature);
      setBookingTicket(false);
    } else {
      if (clickPopup) {
        clickPopup.remove();
        clickPopup = null;
      }
      const popupContent = `
        <div class="station-popup">
          <h3>${feature.properties.stop_name}</h3>
          <p>Stop ID: ${feature.properties.stop_id}</p>
          ${!bookingTicket ? `<button id="book-ticket-button" class="book-ticket-button">Book Ticket</button>` : ''}
        </div>
      `;
  
      clickPopup = new Popup({
        closeButton: false,
        offset: [0, 0],
      })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(popupContent)
        .addTo(mapInstance);
  
      document.getElementById("book-ticket-button").onclick = () =>
        handleBookTicketClick(feature);
    }
  };
  
  
  const reset = () => {
    if (clickPopup) {
      clickPopup.remove();
      clickPopup = null;
    }
    setStartStation(null);
    setEndStation(null);
    setBookingTicket(false);
    setMapStyle("mapbox://styles/marawan1805/clh7miglu00vh01pg1vr50erd");
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [31.2357, 30.0444], // Cairo's longitude and latitude
      zoom: 12,
    });

 
      setMapInstance(map);

  };
  
  

  useEffect(() => {
    if (!mapInstance) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: [31.2357, 30.0444], // Cairo's longitude and latitude
        zoom: 12,
      });

      map.on("load", () => {
        setMapInstance(map);
      });

      // Adding hover effect
      map.on("mousemove", "cairo-metro-stops-1-0uaefr", function (e) {
        if (clickPopup) return;

        map.getCanvas().style.cursor = "pointer";

        if (hoverPopup) hoverPopup.remove();

        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.stop_name;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        hoverPopup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: [0, -15],
        })
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map);
      });

      map.on("mouseleave", "cairo-metro-stops-1-0uaefr", function () {
        map.getCanvas().style.cursor = "";
        if (hoverPopup) hoverPopup.remove();
      });
    } else {
      mapInstance.setStyle(mapStyle);
    }

    return () => {
      if (mapInstance) {
        mapInstance.off("mousemove");
        mapInstance.off("click");
        mapInstance.off("styledata");
        mapInstance.off("style.load");
      }
    };
  }, [mapStyle, mapInstance]);

  useEffect(() => {
    if (mapInstance) {
      mapInstance.on("click", (event) => {
        const features = mapInstance.queryRenderedFeatures(event.point, {
          layers: ["cairo-metro-stops-1-0uaefr"],
        });

        if (features.length > 0) {
          handleStationClick(features[0]);
        }
      });
    }
  }, [mapInstance, bookingTicket]);

  useEffect(() => {
    if (mapInstance && startStation && endStation) {
      mapInstance.setPaintProperty(
        "cairo-metro-stops-1-0uaefr",
        "circle-color",
        [
          "match",
          ["get", "stop_id"],
          endStation.properties.stop_id,
          "#f00", // red color for end station
          startStation.properties.stop_id,
          "#0f0", // green color for start station
          "#000", // black color for other stations
        ]
      );

      mapInstance.flyTo({
        center: endStation.geometry.coordinates,
        zoom: 13,
        speed: 0.8,
      });
    } else if (mapInstance && endStation) {
      mapInstance.setPaintProperty(
        "cairo-metro-stops-1-0uaefr",
        "circle-color",
        [
          "match",
          ["get", "stop_id"],
          endStation.properties.stop_id,
          "#f00", // red color for end station
          "#000", // black color for other stations
        ]
      );

      mapInstance.flyTo({
        center: endStation.geometry.coordinates,
        zoom: 13,
        speed: 0.8,
      });
    }
  }, [mapInstance, startStation, endStation]);

  return (
    <MapContext.Provider value={{ setMapStyle}}>
      <div className="map-wrapper">
        <Header />
        <div className="map-container" ref={mapContainer} />
        {endStation && (
          <div>
            <LocationCards
              startStation={startStation}
              endStation={endStation}
            />
          </div>
        )}
        {endStation && (
          <div>
            <button style={{"zIndex":1000, "position":"absolute"}} onClick={reset}>Reset</button>

          </div>
        )}
        <ThemeSelector />
      </div>
    </MapContext.Provider>
  );
};

export default Map;