import React, {
  useRef,
  useEffect,
  useState,
  createContext,
} from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import ThemeSelector from "../ThemeSelector";
import Header from "../Header/Header";
import LocationCards from "./LocationCards";
import { Button, Card, CardContent, Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import ProceedCard from "./ProceedCard";
import Lottie from "react-lottie";
import animationData from "./mettroos.json";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../../Context/UserContext";
import { List, ListItem, ListItemText } from "@mui/material";

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;
mapboxgl.accessToken =
  "pk.eyJ1IjoibWFyYXdhbjE4MDUiLCJhIjoiY2xoN2tlaXc2MGg4MDNlczZlNjl1cGlvbiJ9.z1IvnyHR-Uo83BIeuuIZBQ";

export const MapContext = createContext();

const Map = () => {
  // states
  const navigate = useNavigate();
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
  const [bookingTicket, setBookingTicket] = useState(false);
  const [bookingStep, setBookingStep] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [searchList, setSearchList] = useState([]);

  // User object from context
  const { user } = useUser();

  // Hover popup
  let hoverPopup = null;
  // Click popup
  let clickPopup = null;

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

  const reset = async () => {
    if (clickPopup) {
      clickPopup.remove();
      clickPopup = null;
    }

    if (hoverPopup) {
      hoverPopup.remove();
      hoverPopup = null;
    }

    setStartStation(null);
    setEndStation(null);
    setBookingTicket(false);
    setBookingStep(0);
    setPrice(0);
    setShortestPath([]);
    setIsProceed(false);
    setSelectedFeature(null);

    const lastSelectedTheme =
      localStorage.getItem("selectedTheme") ||
      "mapbox://styles/marawan1805/clh7obmkt00ph01qt3fz40g7g";
    setMapStyle(lastSelectedTheme);

    if (mapInstance) {
      mapInstance.remove();
      setMapInstance(null);
    }
  };

  const addLayerToMap = async (map) => {
    try {
      const stationsRes = await fetch(
        "https://metro-admin-gray.vercel.app/api/admin/geoJSON"
      );
      const geoJsonStations = await stationsRes.json();

      const routesRes = await fetch(
        "https://metro-admin-gray.vercel.app/api/admin/Routesgeojson"
      );
      const geoJsonRoutes = await routesRes.json();

      if (map.getSource("stations-with-routes-1wpdf9")) {
        map.getSource("stations-with-routes-1wpdf9").setData(geoJsonStations);
      } else {
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
              "black",
            ],
            "line-width": 3,
          },
        });

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
              "black",
            ],
            "circle-radius": 5,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching stations data: ", error);
    }
  };

  // whenever the page is loaded
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

  // making sure same style and data are applied when switching themes
  useEffect(() => {
    if (mapInstance) {
      mapInstance.setStyle(mapStyle);
      mapInstance.once("styledata", async () => {
        await addLayerToMap(mapInstance);
        if (shortestPath.length > 0) {
          drawPathOnMap(mapInstance, shortestPath);
        }
      });
    }
  }, [mapStyle, mapInstance]);

  const calculatePrice = (num) => {
    if (!shortestPath) return 0;
    if (user && user.isSenior === true) {
      if (num <= 9) return 2.5;
      else if (num <= 16 && num >= 10) return 3.5;
      else if (num > 16) return 5;
    } else {
      if (num <= 9) return 5;
      else if (num <= 16 && num >= 10) return 7;
      else if (num > 16) return 10;
    }
  };

  const handleProceedClick = async () => {
    setBookingStep(2);

    if (startStation && endStation) {
      const response = await fetch(
        `https://18.133.171.80/shortest_path?startStation=${startStation.properties.stop_name}&endStation=${endStation.properties.stop_name}`
      );
      const data = await response.json();
      setMiddleStations(data.path);
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

  // Click event listener to extract the station that was clicked from mapbox
  useEffect(() => {
    if (mapInstance) {
      if (bookingStep > 1) return;

      mapInstance.on("click", (event) => {
        if (bookingStep === 2) {
          return;
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

  // Create a list of all route points in the path returned from the shortest path API
  function createGeoJSONLine(path) {
    const coordinates = path.flatMap((station) => station.routePoints);

    return {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: coordinates,
      },
    };
  }

  // Draw the shortest path on the map
  function drawPathOnMap(map, path) {
    if (map.getSource("path")) {
      map.removeLayer("path");
      map.removeSource("path");
    }

    const geoJSON = createGeoJSONLine(path);

    map.addSource("path", {
      type: "geojson",
      data: geoJSON,
    });

    map.addLayer({
      id: "path",
      type: "line",
      source: "path",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#00b0ff",
        "line-width": 8,
        "line-blur": 0.5,
      },
    });
  }

  // handling zoom and centering when selecting the start and end stations
  useEffect(() => {
    if (mapInstance && (startStation || endStation)) {
      mapInstance.setPaintProperty(
        "stations-with-routes-1wpdf9",
        "circle-radius",
        [
          "case",
          ["==", ["get", "stop_id"], startStation?.properties?.stop_id],
          10,
          ["==", ["get", "stop_id"], endStation?.properties?.stop_id],
          10,
          5,
        ]
      );

      const stationToFlyTo = startStation || endStation;
      mapInstance.flyTo({
        center: stationToFlyTo.geometry.coordinates,
        zoom: 13,
        speed: 0.8,
      });
    }
  }, [mapInstance, startStation, endStation]);

  // draw the shortest path on the map
  useEffect(() => {
    if (mapInstance && shortestPath.length > 0) {
      drawPathOnMap(mapInstance, shortestPath);
    }
  }, [mapInstance, shortestPath]);

  // Lottie animation
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
  };

  const handleBook = () => {
    if (user === null) {
      toast.error("Please Login First");
    } else {
      navigate("/payment", {
        state: {
          price: price,
          startLocation: startStation,
          transferStations: shortestPath,
        },
      });
    }
  };

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
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                borderRadius: "5px",
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
                    disabled={!startStation}
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
                    <Typography color="primary" variant="h5">
                      Price: {price} EGP
                    </Typography>
                    <div style={{ marginTop: "10px", display: "flex" }}>
                      <Button
                        variant="contained"
                        onClick={handleBook}
                        color="primary"
                      >
                        Book Ticket
                      </Button>
                      <span style={{ width: "12px" }} />
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={reset}
                      >
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
