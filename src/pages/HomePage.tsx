import HeroSection from "../components/Home/HeroSection";
import ECellStatsSection from "../components/Home/FeatureSection";
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
    </>
  );
};

export default HomePage;
