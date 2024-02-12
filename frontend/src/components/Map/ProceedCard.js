import React, { useState } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import "./LocationCards.css";
import L3 from "../../assets/green-train.png";
import L1 from "../../assets/yellow-train.png";
import L2 from "../../assets/red-train.png";
import loc from "../../assets/loc.png";
import { Card, List } from "@mui/material";

const ProceedCard = ({ startStation, endStation, middleStations }) => {
  // Grouping stations by route id
  const stationsByRoute = middleStations.reduce((acc, station) => {
    if (!acc[station.routeId]) {
      acc[station.routeId] = [];
    }
    acc[station.routeId].push(station);
    return acc;
  }, {});

  // Setting initial state for chevron expansion
  const initialExpandedState = Object.keys(stationsByRoute).reduce(
    (acc, routeId) => {
      acc[routeId] = false;
      return acc;
    },
    {},
  );

  const [expandedState, setExpandedState] = useState(initialExpandedState);

  const toggleExpansion = (routeId) => {
    setExpandedState((prevState) => ({
      ...prevState,
      [routeId]: !prevState[routeId],
    }));
  };

  // Calculating total and estimated time for each stop
  const totalStations = middleStations.length + 1;
  const totalTime = totalStations * 3;

  return (
    <Card
      style={{
        marginTop: "50px",
        height: "60%",
        overflow: "auto",
        width: "310px",
        background: "transparent",
        padding: "20px",
        position: "absolute",
        backgroundColor: "transparent",
        borderRadius: "5px",
      }}
    >
      <List style={{ marginTop: "50px", marginLeft: "-30px" }}>
        {Object.keys(stationsByRoute).map((routeId, index) => {
          const stops = stationsByRoute[routeId];
          const numStops = stops.length;
          const groupTotalTime = numStops * 3;
          return (
            <div className="station-card" key={routeId}>
              <div className="left-side">
                {routeId === "L3" && <img src={L3} alt="Train" />}
                {routeId === "L1" && <img src={L1} alt="Train" />}
                {routeId === "L2" && <img src={L2} alt="Train" />}
                <p>{`Line${routeId.substring(1)}`}</p>
              </div>

              <div
                className={`divider divider-${routeId} ${
                  expandedState[routeId] ? "expanded" : ""
                }`}
              ></div>

              <div className="right-side">
                <h3>{stops[0].name}</h3>
                {index !== 0 && (
                  <p className="sub-text change-station">Change Station</p>
                )}
                <p className="sub-text">
                  {numStops} stops | {groupTotalTime} min
                </p>

                {expandedState[routeId] && (
                  <div className="station-list">
                    {stops.map((station, index) => {
                      if (index !== 0) {
                        return (
                          <div className="station" key={index}>
                            <div className="station-dot"></div>
                            <p className="station-stop-name">{station.name}</p>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
                <div
                  className="icon"
                  onClick={() => numStops > 1 && toggleExpansion(routeId)}
                >
                  {expandedState[routeId] && numStops > 1 ? (
                    <FiChevronUp />
                  ) : (
                    numStops > 1 && <FiChevronDown />
                  )}
                  {numStops === 1 && <div style={{ height: "12px" }}></div>}
                </div>
              </div>
            </div>
          );
        })}
        <div className="station-card exit-card">
          <div className="left-side">
            <img
              style={{ width: "24px", height: "30px" }}
              src={loc}
              alt="Loc"
            />
            <p>Arrival</p>
          </div>
          <div className="divi">
            <svg width="10" height="70">
              <line
                x1="5"
                y1="0"
                x2="5"
                y2="50"
                stroke="gray"
                strokeWidth="2"
                strokeDasharray="2,10"
              />
              <circle cx="5" cy="60" r="5" fill="gray" />
            </svg>
          </div>

          <div className="right-side">
            <h3>{endStation.properties.stop_name}</h3>
            <p className="estimated-time">{totalTime} min</p>
          </div>
        </div>
      </List>
    </Card>
  );
};

export default ProceedCard;
