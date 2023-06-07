import React, { useContext } from "react";
import "./Header.css";
import Menu from "../Menu";
import Search from "../Search/Search";


const Header = ({handleStationClick}) => {
  return (
    <header className="header">
      <div className="header-container">
        <Menu />
        <Search handleStationClick={handleStationClick} />
      </div>
    </header>
  );
};

export default Header;
