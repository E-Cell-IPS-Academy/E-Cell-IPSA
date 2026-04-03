import { Suspense, lazy } from "react";
import HeroSection from "../components/Home/HeroSection";
import ECellStatsSection from "../components/Home/FeatureSection";
import ECellSections from "../components/Home/StaticSection";
import CardStackFeature from "../components/Home/CardStackFeature";
import ParallaxShowcase from "../components/Home/ParallaxShowcase";

const Hero3DBackground = lazy(
  () => import("../components/Home/Hero3DBackground")
);

const HomePage = () => {
  return (
    <>
      {/* Hero Section with 3D Background */}
      <div className="relative">
        <Suspense fallback={null}>
          <Hero3DBackground />
        </Suspense>
        <HeroSection />
      </div>

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
