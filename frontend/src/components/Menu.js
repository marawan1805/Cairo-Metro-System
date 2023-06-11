import React, { useState } from "react";
import "./Menu.css";
import { Link as ScrollLink } from "react-scroll";
import styled from "styled-components";
import logo from "../assets/logo.png";



const LogoLink = ({ href, children }) => {
  return (
    <a href={href} className="logo">
      <img src={logo} alt="logo" style={{"width":"80px"}}/>
      {children}
    </a>
  );
};



const Menu = () => {

  return (
    <div className="menu-container">
      <div className="menu-title">
        {" "}
        <LogoLink href="/"></LogoLink>
      </div>
      
    </div>
  );
};

export default Menu;
