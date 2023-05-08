import React, { useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import styled from "styled-components";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const mobileBreakpoint = "768px";

const HamburgerIcon = styled.div`
  display: none;

  @media (max-width: ${mobileBreakpoint}) {
    width: 30px;
    height: 24px;
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 20;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;

    div {
      width: 100%;
      height: 3px;
      background-color: black;
      transition: transform 0.3s ease-in-out;
    }

    ${({ open }) =>
      open &&
      `
      div:first-child {
        transform: translateY(7.5px) rotate(45deg);
      }

      div:nth-child(2) {
        opacity: 0;
      }

      div:last-child {
        transform: translateY(-7.5px) rotate(-45deg);
      }
    `}
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 40px;
  right: 30px;
  background-color: white;
  width: 300px;
  height: 300px;
  z-index: 10;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(150%)")};
`;

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

const NavMenu = styled.div`
  display: flex;

  li {
    list-style: none;
    margin-left: 20px;
  }

  .nav-link {
    text-decoration: none;
    cursor: pointer;
  }

  @media (max-width: ${mobileBreakpoint}) {
    display: none;
  }
`;

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const toggleModal = () => {
    setOpen(!open);
  };

  const LogoLink = ({ href, children }) => {
    return (
      <a href={href} className="logo">
        <img src={logo} alt="logo" />
        {children}
      </a>
    );
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <LogoLink href="/"></LogoLink>

        <div className="navbar-menu">
          <li>
            <ScrollLink
              className="nav-link"
              to="services"
              smooth={true}
              duration={150}
            >
              Services
            </ScrollLink>
          </li>
          <li>              
              <Link className="nav-link" to="/map">Map</Link>
          </li>

          <li className="nav-link">
            <a href="/booking">Book a Ticket</a>
          </li>
          <li className="nav-link">
            <a href="/login">Login</a>
          </li>
          <li className="nav-link">
            <a href="/signup">Signup</a>
          </li>
        </div>

        <>
          <HamburgerIcon open={open} onClick={toggleModal}>
            <div />
            <div />
            <div />
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
        </>
      </div>
    </nav>
  );
};

export default Navbar;
