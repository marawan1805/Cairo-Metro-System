import React from "react";
import "./LocationCards.css";

const LocationCards = ({ startStation, endStation }) => {
  return (
    <div className="location-cards-container">
      <div className="location-card">
        <h3>Start</h3>
        {startStation ? (
          <p>{startStation.properties.stop_name}</p>
        ) : (
          <p>Select a start station</p>
        )}
      </div>
      <div className="location-card">
        <h3>End</h3>
        {endStation ? (
          <p>{endStation.properties.stop_name}</p>
        ) : (
          <p>Select an end station</p>
        )}
      </div>
    </div>
  );
};

export default LocationCards;
