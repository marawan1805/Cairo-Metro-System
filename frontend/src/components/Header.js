import React from 'react';
import { Navbar } from 'react-bootstrap';
import Menu from './Menu';
import logo from '../assets/logo.png';

const Header = () => {
  return (
    <Navbar expand="lg" className="bg-transparent">
      <Menu />
      <Navbar.Brand className="mx-auto">
        <img src={logo} alt="App Logo" height="40" />
      </Navbar.Brand>
    </Navbar>
  );
};

export default Header;
