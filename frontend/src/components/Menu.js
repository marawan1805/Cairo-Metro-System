import React, { useState } from "react";
import "./Menu.css";
import { Link as ScrollLink } from "react-scroll";
import styled from "styled-components";
import logo from "../assets/logo.png";

const mobileBreakpoint = "7068px";

const HamburgerIcon = styled.div`
  @media (max-width: ${mobileBreakpoint}) {
    z-index: 20;
    cursor: pointer;
    margin-left: 0;
    position: fixed;
    right: 30px;

    div.profile-container {
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
    }

    div.icon-container {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      width: 55px;
      height: auto;
      padding: 8px;
      background-color: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      transition: box-shadow 0.3s ease-in-out;

      &:hover {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
    }

    div.icon-container div {
      width: 15px;
      height: 2px;
      background-color: black;
      transition: transform 0.3s ease-in-out;
      margin-bottom: 3px;
    }

    ${({ open }) =>
    open &&
    `
    div.profile-container div.icon-container div:first-child {
      transform: translateY(3.5px) rotate(45deg);
    }

    div.profile-container div.icon-container div:nth-child(2) {
      opacity: 0;
    }

    div.profile-container div.icon-container div:last-child {
      transform: translateY(-3.5px) rotate(-45deg);
    }
  `}
  
`;

const Modal = styled.div`
  position: fixed;
  top: 60px;
  right: 50px;
  background-color: white;
  width: 300px;
  height: 300px;
  z-index: 10;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(150%)")};
`;

const LogoLink = ({ href, children }) => {
  return (
    <a href={href} className="logo">
      <img src={logo} alt="logo" />
      {children}
    </a>
  );
};

const BlurBackground = styled.div`
  position: ${({ open }) => (open ? "fixed" : "none")};
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: ${({ open }) => (open ? "blur(3px)" : "none")};
  transition: backdrop-filter 0.3s ease-in-out;
  z-index: 00;
`;

const Menu = () => {
  const [open, setOpen] = useState(false);

  const toggleModal = () => {
    setOpen(!open);
  };

  return (
    <div className="menu-container">
      <div className="menu-title">
        {" "}
        <LogoLink href="/"></LogoLink>
      </div>
      <HamburgerIcon open={open} onClick={() => setOpen(!open)}>
        <div className="profile-container">
          <div className="icon-container">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <svg
            style={{ marginLeft: "8px", height: "18px" }} // Adjust the marginLeft
            viewBox="0 0 32 32"
          >
            <path d="m16 .7c-8.437 0-15.3 6.863-15.3 15.3s6.863 15.3 15.3 15.3 15.3-6.863 15.3-15.3-6.863-15.3-15.3-15.3zm0 28c-4.021 0-7.605-1.884-9.933-4.81a12.425 12.425 0 0 1 6.451-4.4 6.507 6.507 0 0 1 -3.018-5.49c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5a6.513 6.513 0 0 1 -3.019 5.491 12.42 12.42 0 0 1 6.452 4.4c-2.328 2.925-5.912 4.809-9.933 4.809z" />
          </svg>
        </div>
      </HamburgerIcon>


      <Modal open={open}>
        <ul>
          <ScrollLink
            className="nav-link"
            to="services"
            smooth={true}
            duration={150}
            as="li"
          >
            Services
          </ScrollLink>
          <ScrollLink
            className="nav-link"
            to="map"
            smooth={true}
            duration={500}
            as="li"
          >
            Map
          </ScrollLink>
          <li className="nav-link">
            <a href="/booking">Book a Ticket</a>
          </li>
        </ul>
      </Modal>
      <BlurBackground open={open} />
    </div>
  );
};

export default Menu;
