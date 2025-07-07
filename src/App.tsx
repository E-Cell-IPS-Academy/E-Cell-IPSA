import { useState } from "react";
import ECellLoader from "./components/core/Loader";
import Navbar from "./components/core/Navbar";
import Footer from "./components/core/Footer";
import HeroSection from "./components/Home/HeroSection";
import ECellStatsSection from "./components/Home/FeatureSection";

const App = () => {
  const [showLoader, setShowLoader] = useState(true);

  const handleLoaderComplete = () => {
    setShowLoader(false);
  };

  return (
    <>
      {/* Loader */}
      {showLoader && <ECellLoader onComplete={handleLoaderComplete} />}

      {/* Main App Content */}
      {!showLoader && (
        <div className="min-h-screen bg-black">
          {/* Navigation */}
          <Navbar />

          {/* Hero Section */}
          <HeroSection />

          {/* Stats Section */}
          <ECellStatsSection />

          {/* Footer */}
          <Footer />
        </div>
      )}
    </>
  );
};

export default App;
