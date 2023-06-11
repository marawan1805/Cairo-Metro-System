import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/">Cairo Metro</Link>
          </div>
          <nav className="footer-navigation">
            <ul>
              <li>
                <Link to="/map">Map</Link>
              </li>
              <li>
                <a href="/booking">Book a Ticket</a>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>
          </nav>
          <div className="footer-social">
            <a href="https://www.facebook.com/CairoMetro" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            <a href="https://www.twitter.com/CairoMetro" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Cairo Metro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
