// Create /pages/HomePage.js
import HeroSection from "../components/Home/HeroSection";
import ECellStatsSection from "../components/Home/FeatureSection";
import ECellSections from "../components/Home/StaticSection";

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <ECellStatsSection />

      {/* About Us Section */}
      <ECellSections />
    </>
  );
};

export default HomePage;