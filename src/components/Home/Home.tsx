import React from 'react';
import Nav from '../Nav/Nav';
import Header from '../Header/Header';
import Body from '../Body/Body';
import Footer from '../Footer/Footer';
import Contact from '../Contact/Contact'
import About from '../About/About';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const Home: React.FC = () => {

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);


  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <div id="header">
        <Header />
      </div>
      <div id="propos-nous">
        <About />
      </div>
      <div id="formations">
        <Body />
      </div>
      <div id="contact">
        <Contact />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
