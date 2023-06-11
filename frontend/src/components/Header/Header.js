import React, { useContext } from "react";
import "./Header.css";
import Search from "../Search/Search";
import Head from "../../ui/ui/header";

const Header = ({handleStationClick, handleSearchClick}) => {
  return (
    <header className="header">
      <div className="header-container">
        <Search handleStationClick={handleStationClick} handleSearchClick={handleSearchClick} />
        <Head/>
      </div>
    </header>
  );
};

export default Header;
