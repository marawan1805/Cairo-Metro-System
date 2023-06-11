import React, {
  useRef,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import mapboxgl, { Popup } from "mapbox-gl";
import "./Map.css";
import ThemeSelector from "../ThemeSelector";
import Header from "../Header/Header";
import LocationCards from "./LocationCards";
import { Button, Card, CardContent, Typography, Grid } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import { StationContext } from "../../Context/StationContext";
import { StationProvider } from "../../Context/StationContext";
import ProceedCard from "./ProceedCard";
import Lottie from "react-lottie";
import animationData from "./mettroos.json"; // import your animation file
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../../Context/UserContext";
import { List, ListItem, ListItemText } from "@mui/material";
import ReactMapGL from "react-map-gl";

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;
mapboxgl.accessToken =
  "pk.eyJ1IjoibWFyYXdhbjE4MDUiLCJhIjoiY2xoN2tlaXc2MGg4MDNlczZlNjl1cGlvbiJ9.z1IvnyHR-Uo83BIeuuIZBQ";

export const MapContext = createContext();

const Map = () => {
  const { allStations } = useContext(StationContext);
  const navigate = useNavigate();
  const [jsonToGeoJson, setJsonToGeoJson] = useState(null);
  const mapContainer = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [startStation, setStartStation] = useState(null);
  const [endStation, setEndStation] = useState(null);
  const [price, setPrice] = useState(0);
  const [mapStyle, setMapStyle] = useState(
    localStorage.getItem("selectedTheme") ||
      "mapbox://styles/marawan1805/clh7obmkt00ph01qt3fz40g7g"
  );
  const [middleStations, setMiddleStations] = useState([]);
  const [shortestPath, setShortestPath] = useState([]);
  const [isProceed, setIsProceed] = useState(false);
  // Hover popup
  let hoverPopup = null;
  // Click popup
  let clickPopup = null;

  const { user, setUser } = useUser();

  const [bookingTicket, setBookingTicket] = useState(false);
  const [bookingStep, setBookingStep] = useState(0);
  const { setHandleStationClick } = useContext(StationContext);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [searchClick, setSearchClick] = useState(false);

  // if (localStorage.getItem("user")) {
  //   setUser(JSON.parse(localStorage.getItem("user")));
  // }

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
    if (feature && feature.properties) {
      if (bookingStep < 2) setSelectedFeature(feature);
    } else {
      console.log("Feature or feature.properties is null or undefined.");
    }
    setSearchList([]);
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

    // Retrieve the last selected theme from the localStorage, or use a default value
    const lastSelectedTheme =
      localStorage.getItem("selectedTheme") ||
      "mapbox://styles/marawan1805/clh7obmkt00ph01qt3fz40g7g";
    setMapStyle(lastSelectedTheme);

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
    setIsProceed(false);

    // reset the hover popup
    if (hoverPopup) {
      hoverPopup.remove();
      hoverPopup = null;
    }

  };

  // Inside your component
  const addLayerToMap = async (map) => {
    try {
      const stationsRes = await fetch(
        "http://metro-admin-gray.vercel.app/api/admin/geoJSON"
      );
      const geoJsonStations = await stationsRes.json();

      const routesRes = await fetch(
        "http://metro-admin-gray.vercel.app/api/admin/Routesgeojson"
      );
      const geoJsonRoutes = await routesRes.json();

      // Check if the source already exists
      if (map.getSource("stations-with-routes-1wpdf9")) {
        // If it does, update it
        map.getSource("stations-with-routes-1wpdf9").setData(geoJsonStations);
      } else {
        // If it doesn't, add the source
        map.addSource("stations-with-routes-1wpdf9", {
          type: "geojson",
          data: geoJsonStations,
        });

        map.addSource("rouutteess", {
          type: "geojson",
          data: geoJsonRoutes,
        });

        map.addLayer({
          id: "rouutteess",
          type: "line",
          source: "rouutteess",
          paint: {
            "line-color": [
              "match",

              ["get", "route_id"],
              "L1",
              "#f2d00d",
              "L2",
              "#e60f0d",
              "L3",
              "#0fbb0c",
              "black", // fallback color if none of the conditions are met
            ],
            "line-width": 3,
          },
        });
        // Add the layer
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
              "#e60f0d",
              "L3",
              "#0fbb0c",
              "black", // fallback color if none of the conditions are met
            ],
            "circle-radius": 5,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching stations data: ", error);
    }
  };

  // When mapInstance is created
  useEffect(() => {
    if (!mapInstance) {
      const lastSelectedTheme =
        localStorage.getItem("selectedTheme") ||
        "mapbox://styles/marawan1805/clh7obmkt00ph01qt3fz40g7g";

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: lastSelectedTheme,
        center: [31.2357, 30.0444], // Cairo's longitude and latitude
        zoom: 12,
      });

      map.on("load", async () => {
        await addLayerToMap(map);
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

  useEffect(() => {
    if (mapInstance) {
      mapInstance.setStyle(mapStyle);
      mapInstance.once("styledata", async () => {
        await addLayerToMap(mapInstance);
        // If there is a path, draw it again
        if (shortestPath.length > 0) {
          drawPathOnMap(mapInstance, shortestPath);
        }
      });
    }
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
      console.log(data.path);
      setMiddleStations(data.path);
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
    if (mapInstance && (startStation || endStation)) {
      mapInstance.setPaintProperty(
        "stations-with-routes-1wpdf9",
        "circle-radius",
        [
          "case",
          ["==", ["get", "stop_id"], startStation?.properties?.stop_id],
          10, // this is the new radius for startStation
          ["==", ["get", "stop_id"], endStation?.properties?.stop_id],
          10, // this is the new radius for endStation
          5, // default radius when not clicked
        ]
      );

      // Fly to the most recently clicked station
      const stationToFlyTo = startStation || endStation;
      mapInstance.flyTo({
        center: stationToFlyTo.geometry.coordinates,
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

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    // rendererSettings: {
    //   preserveAspectRatio: "xMidYMid slice",
    // },
  };

  const handleBook = () => {
    if (user === null) {
      // alert("Please Login First") using toast
      toast.error("Please Login First");
    } else {
      // navigate to payment page and pass price as state
      navigate("/payment", {
        state: {
          price: price,
          startLocation: startStation,
          transferStations: shortestPath,
        },
      });
    }
  };

  const [searchList, setSearchList] = useState([]);

  const handleSearchClick = (searchResults) => {
    setSelectedFeature(null);
    setSearchList(searchResults);
  };

  return (
    <>
      <ToastContainer />{" "}
      <Header
        handleStationClick={handleStationClick}
        handleSearchClick={handleSearchClick}
      />
      <MapContext.Provider value={{ setMapStyle }}>
        <div className="map-wrapper">
          {/* <Header handleStationClick={handleStationClick} /> */}
          <div className="map-container" ref={mapContainer} />
          {searchList.length > 0 && (
            <Card
              style={{
                height: "100%",
                overflow: "auto",
                width: "350px",
                background: "transparent",
                padding: "20px",
                position: "absolute",
                backgroundColor: "white",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)", // add a little box shadow
                borderRadius: "5px", // add border radius
              }}
            >
              <List style={{ marginTop: "50px" }}>
                {searchList.map((station) => (
                  <ListItem
                    button
                    key={station.id}
                    onClick={() => {
                      let feature = {
                        _id: station._id,
                        FID: station.FID,
                        fid: station.fid,
                        geometry: {
                          coordinates: station.geometry.coordinates,
                        },
                        properties: {
                          stop_id: station.stop_id,
                          stop_name: station.stop_name,
                        },
                      };
                      handleStationClick(feature);
                    }}
                  >
                    <ListItemText primary={station.stop_name} />
                  </ListItem>
                ))}
              </List>
            </Card>
          )}

          {selectedFeature && (
            <Card
              style={{
                height: "100%",
                overflow: "hidden",
                width: "350px",
                background: "transparent",
                padding: "20px",
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
                    color="primary"
                    style={{
                      position: "absolute",
                      top: "22px",
                      right: "10px",
                      zIndex: 1000,
                    }}
                  >
                    BACK
                  </Button>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Lottie
                      options={defaultOptions}
                      height={300}
                      width={300}
                      style={{ marginTop: "30px" }}
                    />
                    <Typography variant="h5">
                      {selectedFeature.properties.stop_name}
                    </Typography>
                    <span style={{ height: "12px" }} />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleBookTicketClick(selectedFeature)}
                    >
                      Book Ticket
                    </Button>
                  </div>
                </>
              )}

              {endStation && price === 0 && (
                <LocationCards
                  startStation={startStation}
                  setStartStation={setStartStation}
                  endStation={endStation}
                  setEndStation={setEndStation}
                  // allStations={allStations}
                />
              )}
              {!price && bookingStep === 1 && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 40,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: 0,
                    right: 0,
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
                  <span style={{ width: "12px" }} />
                  <Button variant="outlined" onClick={reset}>
                    Reset
                  </Button>
                </div>
              )}
              {price !== 0 && (
                <>
                  <ProceedCard
                    startStation={startStation}
                    setStartStation={setStartStation}
                    endStation={endStation}
                    setEndStation={setEndStation}
                    middleStations={middleStations}
                    // allStations={allStations}
                  />
                  <CardContent
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      bottom: 0,
                      width: "350px",
                      left: 0,
                    }}
                  >
                    <Typography color="primary" variant="h5">Price: {price} EGP</Typography>
                    <div style={{ marginTop:"10px",display: "flex"}} >
                    <Button
                      variant="contained"
                      onClick={handleBook}
                      color="primary"
                    >
                      Book Ticket
                    </Button>
                    <span style={{ width: "12px" }} />
                    <Button variant="outlined" color="primary" onClick={reset}>
                      Cancel
                    </Button>
                    </div>
                  </CardContent>
                </>
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
