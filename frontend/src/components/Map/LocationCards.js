import React from "react";
import "./LocationCards.css";
import purpleTrain from "../../assets/train-b947fe.png";
import orangeTrain from "../../assets/train-fe6101.png";

const LocationCards = ({ startStation, endStation }) => {
  return (
    <div className="location-cards-container">
      <div className="location-card">
        <img className="logo-img" src={purpleTrain} alt="Train" />
        {startStation ? (
          <p>{startStation.properties.stop_name}</p>
        ) : (
          <p>Select a start station</p>
        )}
      </div>
      <div className="location-card">
        <img className="logo-img" src={orangeTrain} alt="Train" />

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
