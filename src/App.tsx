// Updated App.tsx with all authentication routes
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ECellLoader from "./components/core/Loader";
import Navbar from "./components/core/Navbar";
import Footer from "./components/core/Footer";
import HomePage from "./pages/HomePage";
import PastEventsPage from "./pages/PastEventsPage";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import StartupOfWeek from "./pages/StartupOfWeek";
import UserDashboard from "./pages/UserDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import BlogListing from "./pages/BlogListing";
import BlogDetail from "./pages/BlogDetail";
import Gallery from "./pages/Gallery";
import ProtectedRoute from "./components/admin/ProtectedRoute";

const App: React.FC = () => {
  const [showLoader, setShowLoader] = useState<boolean>(true);

  const handleLoaderComplete = (): void => {
    setShowLoader(false);
  };

  return (
    <>
      {/* Loader */}
      {showLoader && <ECellLoader onComplete={handleLoaderComplete} />}

      {/* Main App Content */}
      {!showLoader && (
        <AuthProvider>
          <Router>
            <Routes>
              {/* Admin Routes - No Navbar/Footer */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* User Authentication Routes - No Navbar/Footer */}
              <Route path="/login" element={<UserLogin />} />
              <Route path="/signup" element={<UserSignup />} />

              {/* User Dashboard - With Navbar/Footer */}
              <Route
                path="/dashboard"
                element={
                  <div className="min-h-screen bg-black">
                    <Navbar />
                    <UserDashboard />
                    <Footer />
                  </div>
                }
              />

              {/* Public Routes - With Navbar/Footer */}
              <Route
                path="/*"
                element={
                  <div className="min-h-screen bg-black">
                    <Navbar />
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/past-events" element={<PastEventsPage />} />
                      <Route path="/gallery" element={<Gallery />} />
                      <Route path="/blog" element={<BlogListing />} />
                      <Route path="/startup" element={<StartupOfWeek />} />
                      <Route path="/blog/:slug" element={<BlogDetail />} />
                    </Routes>
                    <Footer />
                  </div>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      )}
    </>
  );
};

export default App;
