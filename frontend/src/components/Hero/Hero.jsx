// // Hero.js
import React, { useEffect, useRef } from "react";
// import Navbar from "../Navbar/Navbar";
// import mtt from "../../assets/mtt.png";
// import ComplexGradientAnimation from "../Canvas";

// const Hero = () => {
//   const videoRef = useRef(null);

//   const handleScroll = () => {
//     if (videoRef.current) {
//       videoRef.current.currentTime =
//         (window.scrollY / document.body.scrollHeight) *
//         videoRef.current.duration;
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("scroll", handleScroll);

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   const heroSectionStyle = {
//     height: window.innerHeight - 100 + "px",
//   };

//   return (
//     <section id="hero" className="hero-section" style={heroSectionStyle}>
//       <div className="hero-wrapper">
//       <Navbar />  
//       <img src={mtt} alt="mtt" className="hero-content-image" />
//       <div className="container centered">
//         <div className="hero-content">
//           <div class="hero-content-text">
//             <h1 class="line line1">Fast,</h1>
//             <h1 class="line line2">Convenient</h1>
//             <h1 class="line line3">and Reliable</h1>
//           </div>
//         </div>
//       </div>
    
//       </div>
//     </section>
//   );
// };

// export default Hero;

import { motion } from "framer-motion";

import { styles } from "./styles";
import { ComputersCanvas } from "../canvas/index";

const Hero = () => {
  return (
    <section className={`relative w-full h-screen mx-auto`}>
      <div
        className={`absolute inset-0 top-[120px]  max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
      >
        <div className='flex flex-col justify-center items-center mt-5'>
          <div className='w-5 h-5 rounded-full bg-[#915EFF]' />
          <div className='w-1 sm:h-80 h-40 violet-gradient' />
        </div>

        <div>
          <h1 className={`${styles.heroHeadText} text-white`}>
            Hi, I'm <span className='text-[#915EFF]'>Adrian</span>
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            I develop 3D visuals, user <br className='sm:block hidden' />
            interfaces and web applications
          </p>
        </div>
      </div>

      <ComputersCanvas />

      <div className='absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center'>
        <a href='#about'>
          <div className='w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2'>
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className='w-3 h-3 rounded-full bg-secondary mb-1'
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;

