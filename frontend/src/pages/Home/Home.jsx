import React from "react";
import Hero from "../../components/HeroSection/Hero";
import FeatureSection from "../../components/FeatureSection/FeatureSection";
import AppDownload from "../../components/AppDownload/AppDownload";

const Home = () => {
  return (
    <div className="w-full overflow-hidden">
      <Hero />
      <FeatureSection />
      <AppDownload />
    </div>
  );
};

export default Home;
