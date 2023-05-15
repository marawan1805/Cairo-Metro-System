// Hero.js
import React, { useEffect, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import mtt from "../../assets/mtt.png";
import ComplexGradientAnimation from "../Canvas";

const Hero = () => {
  const videoRef = useRef(null);

  const handleScroll = () => {
    if (videoRef.current) {
      videoRef.current.currentTime =
        (window.scrollY / document.body.scrollHeight) *
        videoRef.current.duration;
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const heroSectionStyle = {
    height: window.innerHeight - 100 + "px",
  };

  return (
    <section id="hero" className="hero-section" style={heroSectionStyle}>
      <ComplexGradientAnimation />
      <div className="hero-wrapper">
      <Navbar />  
      <img src={mtt} alt="mtt" className="hero-content-image" />
      <div className="container centered">
        <div className="hero-content">
          <div class="hero-content-text">
            <h1 class="line line1">Fast,</h1>
            <h1 class="line line2">Convenient</h1>
            <h1 class="line line3">and Reliable</h1>
          </div>
        </div>
      </div>
    
      </div>
    </section>
  );
};

export default Hero;
