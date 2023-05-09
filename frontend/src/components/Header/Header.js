import React from "react";
import "./Header.css";
import Menu from "../Menu";
import Search from "../Search/Search";

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Menu />
        <Search />
      </div>
    </header>
  );
};

export default Header;
