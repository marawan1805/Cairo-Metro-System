// Context/StationContext.js

import React, { createContext, useState } from "react";

export const StationContext = createContext();

export const StationProvider = ({ children }) => {
  const [allStations, setAllStations] = useState([]);
  const [handleStationClick, setHandleStationClick] = useState(null);

  const fetchStations = () => {
    fetch("http://localhost:3008/api/admin/")
      .then((response) => response.json())
      .then((data) => {
        setAllStations(data);
        console.log(data);
      });
  };

  return (
    <StationContext.Provider value={{ allStations, setAllStations, handleStationClick, setHandleStationClick, fetchStations }}>
      {children}
    </StationContext.Provider>
  );
};
