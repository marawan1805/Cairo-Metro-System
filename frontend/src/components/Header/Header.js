import React, { useContext } from "react";
import "./Header.css";
import Menu from "../Menu";
import Search from "../Search/Search";
import {StationContext} from '../../Context/StationContext';


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
