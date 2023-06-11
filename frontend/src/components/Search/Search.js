import "./Search.css";

import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { StationContext } from "../../Context/StationContext";

const SearchBoxStyled = styled.div`
  .search-box {
    border: 1px solid #ddd;
    border-radius: 40px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.2s ease;
    width: 300px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    padding: 10px;
    position: relative;
    background-color: #fff;
  }
  .search-box:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .search-box input:focus {
    outline: none;
  }
  .search-results {
    background-color: #fff;
    position: absolute;
    top: 60px;
    width: 90%;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 99;
  }
  .search-results div {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
    color: #333;
  }
  .search-results div:hover {
    background: #ddd;
  }
`;

const Search = ({ handleStationClick, handleSearchClick }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [showResults, setShowResults] = useState(false);

  const { allStations, fetchStations } = useContext(StationContext);
  // console.log(allStations)
  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const handleChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchInput(event.target.value);
    setShowResults(true);
    const results = allStations.filter((station) =>
      station.stop_name.toLowerCase().startsWith(query)
    );
    setSearchResults(results);
  };

  const handleResultClick = (station) => {
    console.log("Search result click station:", station);
    setSearchInput("");
    setShowResults(false);

    // Parse coordinates from the geometry string
    let coordinates = station.geometry
      .replace("POINT (", "")
      .replace(")", "")
      .split(" ")
      .map(Number);

    // Create a feature-like object to pass to handleStationClick
    let feature = {
      _id: station._id,
      FID: station.FID,
      fid: station.fid,
      geometry: {
        coordinates: coordinates,
      },
      properties: {
        stop_id: station.stop_id,
        stop_name: station.stop_name,
      },
    };

    handleStationClick(feature);
  };

  return (
    <SearchBoxStyled>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search"
          value={searchInput}
          style={{
            border: "none",
            outline: "none",
            fontSize: "16px",
            width: "90%",
            position: "relative",
            zIndex: "100",
          }}
          onChange={handleChange}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              handleSearchClick(searchResults);
              setSearchResults([]);
              setSearchInput("");
            }
          }}
        />

        {showResults && (
          <div className="search-results">
            {searchResults.map((station) => (
              <div key={station.id} onClick={() => {handleResultClick(station)}}>
                {station.stop_name}
              </div>
            ))}
          </div>
        )}
        <div className="circle-12">
          <svg
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              color: "#fff",
              cursor: "pointer",
              display: "block",
              fill: "none",
              height: "12px",
              width: "12px",
              stroke: "currentColor",
              "stroke-width": "5.333333333333333",
              overflow: "visible",
            }}
            aria-hidden="true"
            role="presentation"
            focusable="false"
            onClick={() => {
              handleSearchClick(searchResults);
              setSearchResults([]);
              setSearchInput("");
            }}
          >
            <g fill="none">
              <path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"></path>
            </g>
          </svg>
        </div>
      </div>
    </SearchBoxStyled>
  );
};

export default Search;
