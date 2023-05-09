// Hero.js
import React, { useEffect, useRef } from "react";
import metroVideo from "../../assets/metro-video.mp4";
import Navbar from "../Navbar/Navbar";

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
    height: window.innerHeight + "px",
  };

  return (
    <section id="hero" className="hero-section" style={heroSectionStyle}>
      <video className="background-video" ref={videoRef} muted loop>
        <source src={metroVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
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
