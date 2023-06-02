import React from "react";
import { InView } from "react-intersection-observer";
import Hero from "../../components/Hero/Hero";
import Services from "../../components/Services/Services";
import Footer from "../../components/Footer/Footer";
import "../../styles.css";
import {useLocation} from 'react-router-dom';

const HomePage = () => {
  const location = useLocation();
    const data = location.state.dat;
    console.log(data);
    return (
    <div className="home-page">
      <div className='relative z-0 bg-primary'>
        <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
      {data ?<Hero user={data}></Hero>:<Hero />}
   
      </div>
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
    </div>
  );
};

export default HomePage;
