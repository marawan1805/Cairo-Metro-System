import React, {
  useRef,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import mapboxgl, { Popup } from "mapbox-gl";
import "./Map.css";
import Menu from "../Menu";
import ThemeSelector from "../ThemeSelector";
import Header from "../Header/Header";
import LocationCards from "./LocationCards";
import { Button, Card, CardContent, Typography, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import { StationContext } from "../../Context/StationContext";
import { StationProvider } from "../../Context/StationContext";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWFyYXdhbjE4MDUiLCJhIjoiY2xoN2tlaXc2MGg4MDNlczZlNjl1cGlvbiJ9.z1IvnyHR-Uo83BIeuuIZBQ";

export const MapContext = createContext();

const Map = () => {
  const { allStations } = useContext(StationContext);

  const [jsonToGeoJson, setJsonToGeoJson] = useState(null);
  const mapContainer = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [startStation, setStartStation] = useState(null);
  const [endStation, setEndStation] = useState(null);
  const [price, setPrice] = useState(0);
  const [mapStyle, setMapStyle] = useState(
    "mapbox://styles/marawan1805/clh7obmkt00ph01qt3fz40g7g"
  );
  const [shortestPath, setShortestPath] = useState([]);
  const [isProceed, setIsProceed] = useState(false);
  // Hover popup
  let hoverPopup = null;
  // Click popup
  let clickPopup = null;

  const [bookingTicket, setBookingTicket] = useState(false);
  const [bookingStep, setBookingStep] = useState(0);
  const { setHandleStationClick } = useContext(StationContext);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const handleBookTicketClick = (feature) => {
    if (bookingTicket) {
      if (!isProceed) {
        setStartStation(feature);
      }
      setBookingTicket(false);
      if (bookingStep < 2) setSelectedFeature(feature);
      return;
    }
    setBookingTicket(true);
    setEndStation(feature);
    setBookingStep(1);
    if (bookingStep < 2) setSelectedFeature(feature);
  };

  const handleStationClick = (feature) => {
    console.log(feature);
    if (feature && feature.properties) {
      if (bookingStep < 2) setSelectedFeature(feature);
    } else {
      console.log("Feature or feature.properties is null or undefined.");
    }
  };

  // useEffect(() => {
  //   setHandleStationClick(handleStationClick);
  // }, [setHandleStationClick, handleStationClick]);

  const reset = async () => {
    if (clickPopup) {
      clickPopup.remove();
      clickPopup = null;
    }
    setStartStation(null);
    setEndStation(null);
    setBookingTicket(false);
    setMapStyle("mapbox://styles/marawan1805/clh7obmkt00ph01qt3fz40g7g");
    setSelectedFeature(null);
    // remove the map instance
    if (mapInstance) {
      mapInstance.remove();
      setMapInstance(null);
    }

    // reset the booking step
    setBookingStep(0);
    setPrice(0);
    setShortestPath([]);
    setStartStation(null);

  };

  useEffect(() => {
    if (!mapInstance) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: [31.2357, 30.0444], // Cairo's longitude and latitude
        zoom: 12,
      });
      setTimeout(1000);

      map.on("load", async () => {
        try {

          const response = await fetch("http://metro-admin-gray.vercel.app/api/admin/geoJSON");
          const geoJsonStations = await response.json();
      
          map.addSource("stations-with-routes-1wpdf9", {
            type: "geojson",
            data: geoJsonStations,
          });

          // Now you can add the layer here after the source has been added
          map.addLayer({
            id: "stations-with-routes-1wpdf9",
            type: "circle",
            source: "stations-with-routes-1wpdf9",
            paint: {
              "circle-color": [
                "match",
                ["get", "route_id"],
                "L1",
                "#f2d00d",
                "L2",
                "black",
                "L3",
                "black",
                "black", // fallback color if none of the conditions are met
              ],
              "circle-radius": 5,
            },
          });
        } catch (error) {
          console.error("Error fetching stations data: ", error);
        }
      });


      map.on("load", () => {
        setMapInstance(map);
      });

      // Adding hover effect
      map.on("mousemove", "stations-with-routes-1wpdf9", function (e) {
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

      map.on("mouseleave", "stations-with-routes-1wpdf9", function () {
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

  const calculatePrice = (num) => {
    if (!shortestPath) return 0;
    if (num <= 9) return 5;
    else if (num <= 16 && num >= 10) return 7;
    else if (num > 16) return 10;
  };

  const handleProceedClick = async () => {
    setBookingStep(2);

    if (startStation && endStation) {
      const response = await fetch(
        `http://18.134.158.73/shortest_path?startStation=${startStation.properties.stop_name}&endStation=${endStation.properties.stop_name}`
      );
      const data = await response.json();
      // Set the shortest path
      setShortestPath(
        data.path.map((station) => ({
          ...station,
          geometry: {
            coordinates: station.routePoints,
          },
        }))
      );

      const price = calculatePrice(data.path.length);
      setPrice(price);
    }
  };
  useEffect(() => {
    console.log(bookingStep);
    if (mapInstance) {
      if (bookingStep > 1) return;

      mapInstance.on("click", (event) => {
        if (bookingStep === 2) {
          return; // Skip the click event handling if in the 'proceed' step
        }

        const features = mapInstance.queryRenderedFeatures(event.point, {
          layers: ["stations-with-routes-1wpdf9"],
        });

        if (features.length > 0) {
          console.log("Map click features:", features);
          if (bookingTicket) {
            if (
              startStation &&
              startStation.properties.stop_id === features[0].properties.stop_id
            ) {
              return;
            }
            if (isProceed) {
              return;
            }
            setStartStation(features[0]);
            setBookingTicket(false);
          } else {
            handleStationClick(features[0]);
          }
        }
      });
    }
  }, [mapInstance, bookingTicket, startStation, bookingStep]); // Include bookingStep in dependencies

  function createGeoJSONLine(path) {
    // Create a list of all route points across all stations
    const coordinates = path.flatMap((station) => station.routePoints);

    return {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: coordinates,
      },
    };
  }

  function drawPathOnMap(map, path) {
    if (map.getSource("path")) {
      // Ensure that the source and layer do not already exist before attempting to add them
      map.removeLayer("path");
      map.removeSource("path");
    }

    // Convert the path into a LineString GeoJSON
    const geoJSON = createGeoJSONLine(path);

    // Add a data source for the path
    map.addSource("path", {
      type: "geojson",
      data: geoJSON,
    });

    // Add a new line layer to draw the path
    map.addLayer({
      id: "path",
      type: "line",
      source: "path",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#00b0ff", // Blue color for the line
        "line-width": 8, // Thin line
        "line-blur": 0.5, // Adding a small blur will make the line and resumed at msg4.Rollback."]
      },
    });
  }

  useEffect(() => {
    if (mapInstance && startStation && endStation) {
      // mapInstance.setPaintProperty(
      //   "stations-with-routes-1wpdf9",
      //   "circle-color",
      //   [
      //     "match",
      //     ["get", "stop_id"],
      //     startStation.properties.stop_id,
      //     "#008000",
      //   ]
      // );

      mapInstance.flyTo({
        center: endStation.geometry.coordinates,
        zoom: 12,
        speed: 0.8,
      });
    } else if (mapInstance && endStation) {
      mapInstance.setPaintProperty(
        "stations-with-routes-1wpdf9",
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

  useEffect(() => {
    if (mapInstance && shortestPath.length > 0) {
      // This is just a stub. Replace this with the actual code to draw the path on the map.
      drawPathOnMap(mapInstance, shortestPath);
    }
  }, [mapInstance, shortestPath]);

  return (
    <>
      {" "}
      <Header handleStationClick={handleStationClick} />
      <MapContext.Provider value={{ setMapStyle }}>
        <div className="map-wrapper">
          {/* <Header handleStationClick={handleStationClick} /> */}
          <div className="map-container" ref={mapContainer} />

          {selectedFeature && (
            <Card
              style={{
                height: "100%",
                overflow: "hidden",
                width: "350px",
                background: "transparent",
                padding: "20px",
                height: "100%",
                position: "absolute",
                backgroundColor: "white",
              }}
            >
              {bookingStep === 0 && (
                <>
                  <Button
                    onClick={() => {
                      setSelectedFeature(null);
                    }}
                  >
                    {" "}
                    BACK
                  </Button>
                  <img
                    src={selectedFeature.properties.imageUrl}
                    alt={selectedFeature.properties.stop_name}
                    style={{ width: "100%", height: "auto" }}
                  />
                  <Typography variant="h5">
                    {selectedFeature.properties.stop_name}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleBookTicketClick(selectedFeature)}
                  >
                    Book Ticket
                  </Button>
                </>
              )}
              {endStation && (
                <LocationCards
                  startStation={startStation}
                  setStartStation={setStartStation}
                  endStation={endStation}
                  setEndStation={setEndStation}
                  // allStations={allStations}
                />
              )}
              {/* {!price && bookingStep === 1 && ( */}
              <div
                style={{
                  marginTop: "50px",
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleProceedClick();
                    setIsProceed(true);
                  }}
                  disabled={!startStation} // disable if startStation is not selected
                >
                  Proceed
                </Button>

                <Button variant="outlined" onClick={reset}>
                  Reset
                </Button>
              </div>
              {/* )} */}
              {price !== 0 && (
                <CardContent
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#151719",
                    position: "absolute",
                    bottom: 0,
                    width: "350px",
                    left: 0,
                  }}
                >
                  <Typography variant="h5">Price: {price} EGP</Typography>
                  <Link variant="contained" color="primary" to="/payment">
                    Book Ticket
                  </Link>
                  <Button variant="outlined" onClick={reset}>
                    Cancel
                  </Button>
                </CardContent>
              )}
            </Card>
          )}
          <ThemeSelector />
        </div>
      </MapContext.Provider>
    </>
  );
};

export default Map;
