import React from "react";
import { InView } from "react-intersection-observer";
import Hero from "../../components/Hero/Hero";
import Services from "../../components/Services/Services";
import Footer from "../../components/Footer/Footer";
import "../../styles.css";

const HomePage = () => {
  return (
    <div className="home-page">
      <Hero />
      <InView threshold={0.3}>
        {({ inView, ref }) => (
          <div
            ref={ref}
            className={`services-section fade-in left ${
              inView ? "visible" : ""
            }`}
          >
            <Services />
          </div>
        )}
      </InView>
      <InView threshold={0.2}>
        {({ inView, ref }) => (
          <div
            ref={ref}
            className={`services-section fade-in right ${
              inView ? "visible" : ""
            }`}
          >
            <Services />
          </div>
        )}
      </InView>
      <Footer />
    </div>
  );
};

export default HomePage;
