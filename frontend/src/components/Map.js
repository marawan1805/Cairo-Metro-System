import React, { useRef, useEffect, useState, createContext } from "react";
import mapboxgl, { Popup } from "mapbox-gl";
import "./Map.css";
import Menu from "./Menu";
import ThemeSelector from "./ThemeSelector";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWFyYXdhbjE4MDUiLCJhIjoiY2xoN2tlaXc2MGg4MDNlczZlNjl1cGlvbiJ9.z1IvnyHR-Uo83BIeuuIZBQ";

export const MapContext = createContext();

const Map = () => {
  const mapContainer = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [mapStyle, setMapStyle] = useState(
    "mapbox://styles/marawan1805/clh7miglu00vh01pg1vr50erd"
  );

  let hoverPopup = null;
  let clickPopup = null;

  const createHoverPopup = (feature) => {
    if (hoverPopup) {
      hoverPopup.remove();
    }

    const popupContent = `
    <div class="station-popup">
      <h3>${feature.properties.stop_name}</h3>
      <p>Stop ID: ${feature.properties.stop_id}</p>
      <button class="book-ticket-button">Book Ticket</button>
    </div>
  `;

    hoverPopup = new Popup({
      closeButton: false,
      offset: [0, 0],
    })
      .setLngLat(feature.geometry.coordinates)
      .setHTML(popupContent)
      .addTo(mapInstance);
  };

  const createClickPopup = (feature) => {
    if (
      clickPopup &&
      clickPopup._lngLat.lng === feature.geometry.coordinates[0] &&
      clickPopup._lngLat.lat === feature.geometry.coordinates[1]
    ) {
      return;
    }

    // Check if there is an existing clickPopup and remove it
    if (clickPopup) {
      clickPopup.remove();
    }

    const popupContent = `
    <div class="station-popup">
      <h3>${feature.properties.stop_name}</h3>
      <p>Stop ID: ${feature.properties.stop_id}</p>
      <button class="book-ticket-button">Book Ticket</button>
    </div>
  `;
    clickPopup = new Popup({
      closeButton: false,
      offset: [0, 0],
    })
      .setLngLat(feature.geometry.coordinates)
      .setHTML(popupContent)
      .addTo(mapInstance);
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
      mapInstance.on("mousemove", (event) => {
        const features = mapInstance.queryRenderedFeatures(event.point, {
          layers: ["cairo-metro-stops-1-0uaefr"],
        });

        if (features.length > 0) {
          mapInstance.getCanvas().style.cursor = "pointer";
          const hoveredFeature = features[0];
          createHoverPopup(hoveredFeature);
        } else {
          if (hoverPopup) {
            hoverPopup.remove();
          }
        }
      });

      mapInstance.on("click", (event) => {
        if (hoverPopup) {
          hoverPopup.remove();
        }

        const features = mapInstance.queryRenderedFeatures(event.point, {
          layers: ["cairo-metro-stops-1-0uaefr"],
        });

        if (features.length > 0) {
          const clickedFeature = features[0];
          setSelectedStation(clickedFeature);
        } else {
          setSelectedStation(null);
        }
      });
    }
  }, [mapInstance]);

  useEffect(() => {
    if (mapInstance && selectedStation) {
      createClickPopup(selectedStation);

      mapInstance.setPaintProperty(
        "cairo-metro-stops-1-0uaefr",
        "circle-radius",
        [
          "match",
          ["get", "stop_id"],
          selectedStation.properties.stop_id,
          20, // The new circle radius when a station is clicked
          10, // The default circle radius for other stations
        ]
      );

      // Zoom in and pan to the clicked station
      mapInstance.flyTo({
        center: selectedStation.geometry.coordinates,
        zoom: 13, // Adjust this value to change the zoom level when a station is clicked
        speed: 0.8,
      });
    } else if (mapInstance) {
      mapInstance.setPaintProperty(
        "cairo-metro-stops-1-0uaefr",
        "circle-radius",
        10
      );
    }
  }, [mapInstance, selectedStation]);

  return (
    <MapContext.Provider value={{ setMapStyle }}>
      <div className="map-wrapper">
        <Menu />
        <div className="map-container" ref={mapContainer} />
        <ThemeSelector />
      </div>
    </MapContext.Provider>
  );
};

export default Map;
