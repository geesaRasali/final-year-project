import React, { useState } from "react";
import "./Home.css";
import Hero from "../../components/HeroSection/Hero";
import FeatureSection from "../../components/FeatureSection/FeatureSection";
import AppDownload from "../../components/AppDownload/AppDownload";

const Home = () => {
  const [category, setCategory] = useState("All");

  return (
    <div>
      <Hero />
      <FeatureSection />
      <AppDownload />
    </div>
  );
};

export default Home;
