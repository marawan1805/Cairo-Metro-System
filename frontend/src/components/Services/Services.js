import React from "react";

const Services = () => {
  return (
    <section id="services" className="services-section">
      <div className="container">
        <h2>Our Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <img src="../assets/logo.png" alt="Service 1" effect="blur" />
            <h3>Fast Transit</h3>
            <p>Efficient and fast transportation system to save your time.</p>
          </div>
          <div className="service-card">
            <img src="../assets/logo.png" alt="Service 2" effect="blur" />
            <h3>Accessibility</h3>
            <p>Fully accessible metro system for people with disabilities.</p>
          </div>
          <div className="service-card">
            <img src="../assets/logo.png" alt="Service 3" effect="blur" />
            <h3>Comfort</h3>
            <p>Comfortable and clean trains for a pleasant journey.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
