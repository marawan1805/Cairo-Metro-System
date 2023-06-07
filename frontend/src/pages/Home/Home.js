// import React from "react";
// import { InView } from "react-intersection-observer";
// import Hero from "../../components/Hero/Hero";
// import Services from "../../components/Services/Services";
// import Footer from "../../components/Footer/Footer";
// import "../../styles.css";
// import {useLocation} from 'react-router-dom';

// const HomePage = () => {
//   const location = useLocation();
//   var data = null;
//   if (location.state){
//      data = location.state.dat;
//     console.log(data);}
//     return (
//     <div className="home-page">
//       <div className='relative z-0 bg-primary'>
//         <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
//       {data ?<Hero user={data}></Hero>:<Hero />}

//       </div>
//       <InView threshold={0.3}>
//         {({ inView, ref }) => (
//           <div
//             ref={ref}
//             className={`services-section fade-in left ${
//               inView ? "visible" : ""
//             }`}
//           >
//             <Services />
//           </div>
//         )}
//       </InView>
//       <InView threshold={0.2}>
//         {({ inView, ref }) => (
//           <div
//             ref={ref}
//             className={`services-section fade-in right ${
//               inView ? "visible" : ""
//             }`}
//           >
//             <Services />
//           </div>
//         )}
//       </InView>
//       <Footer />
//     </div>
//     </div>
//   );
// };

// export default HomePage;

import Hero from "../../ui/hero";
import Features from "../../ui/features";
import Newsletter from "../../ui/newsletter";
import Zigzag from "../../ui/zigzag";
import Testimonials from "../../ui/testimonials";
import "../../styles.css";

import Header from "../../ui/ui/header";
import Banner from "../../ui/banner";
import GoogleFontLoader from 'react-google-font-loader';
import { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";

import PageIllustration from "../../ui/page-illustration";
import Footer from "../../ui/ui/footer";
import { GlobalStyle, StyledH1 } from '../../globalStyles.js';
import '../../styles.css'

export default function Home() {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 600,
      easing: "ease-out-sine",
    });
  });

  return (
    <>
     <GoogleFontLoader
        fonts={[
          {
            font: 'Inter',
            weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
          },
          {
            font: 'Architects Daughter',
            weights: [400],
          },
        ]}
        subsets={['latin']}
      />
    <GlobalStyle />
        <div className="flex flex-col min-h-screen overflow-hidden">
          <Header />
          <main className="grow">
            <PageIllustration />

            <Hero />
            <Features />
            <Zigzag />
            <Testimonials />
            <Newsletter />
            <Banner />
          </main>

          <Footer />
        </div>
      </>
  );
}
