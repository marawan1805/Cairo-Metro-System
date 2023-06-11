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
import { GlobalStyle } from '../../globalStyles.js';
import '../../styles.css'
import { useUser } from "../../Context/UserContext";

export default function Home() {
  const { user } = useUser();

  console.log(user)
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
          <Header user={user}/>
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
