import React, { useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { Menu as MenuIcon } from "@mui/icons-material";
import "./Menu.css";

const Menu = () => {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <div className="menu-container">
      <Button variant="outline-light" className="border-0" onClick={handleShow}>
        <MenuIcon className="menu-icon" />
      </Button>
      <div className="menu-title">Cairo Metro System</div>
      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="menu-title" style={{ fontSize: "20px" }}>
            Menu
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="list-unstyled">
            <li>
              <a href="/" onClick={handleClose} className="menu-link">
                Home
              </a>
            </li>
            <li>
              <a href="/tickets" onClick={handleClose} className="menu-link">
                Tickets
              </a>
            </li>
            <li>
              <a href="/account" onClick={handleClose} className="menu-link">
                Account
              </a>
            </li>
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default Menu;
