import React, { createContext, useState } from "react";

export const StationContext = createContext();

export const StationProvider = ({ children }) => {
  const [allStations, setAllStations] = useState([]);
  const [handleStationClick, setHandleStationClick] = useState(null);

  const fetchStations = () => {
    fetch("https://metro-admin-gray.vercel.app/api/admin/")
      .then((response) => response.json())
      .then((data) => {
        setAllStations(data);
      });
  };

  return (
    <StationContext.Provider
      value={{
        fetchStations,
        allStations,
        setAllStations,
        handleStationClick,
        setHandleStationClick,
      }}
    >
      {children}
    </StationContext.Provider>
  );
};
