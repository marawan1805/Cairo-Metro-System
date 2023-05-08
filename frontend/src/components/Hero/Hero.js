// Hero.js
import React from "react";
import metro from "../../assets/metro.png";
import Navbar from "../Navbar/Navbar";

const Hero = () => {
  return (
    <section
      id="hero"
      className="hero-section"
      style={{ backgroundImage: `url(${metro})` }}
    >
      <div className="black-tint">
        <Navbar />

        <div className="container centered">
          <div className="hero-content">
            <h1>Cairo Metro</h1>
            <p>Fast, Convenient, and Reliable Transit in Cairo</p>
            <a href="/booking" className="btn btn-primary">
              Book a Ticket
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
