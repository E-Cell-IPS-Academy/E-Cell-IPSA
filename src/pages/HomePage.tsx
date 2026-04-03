import HeroSection from "../components/Home/HeroSection";
import ECellStatsSection from "../components/Home/FeatureSection";
import ECellSections from "../components/Home/StaticSection";
import CardStackFeature from "../components/Home/CardStackFeature";
import ParallaxShowcase from "../components/Home/ParallaxShowcase";

const HomePage = () => {
  return (
    <>
      {/* Hero Section (includes its own 3D background) */}
      <HeroSection />

      {/* Stats Section */}
      <ECellStatsSection />

      {/* Card Stacking Feature Section */}
      <CardStackFeature />

      {/* Parallax Showcase with Illustrations */}
      <ParallaxShowcase />

      {/* About, Mission, Vision Sections */}
      <ECellSections />
    </>
  );
};

export default HomePage;
