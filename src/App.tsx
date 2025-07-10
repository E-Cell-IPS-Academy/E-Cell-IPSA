// Updated App.tsx with complete AdminLayout integration
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
import AdminEventsComplete from "./pages/admin/AdminEvents";
import AdminBlogsComplete from "./pages/admin/AdminBlogsComplete";
import AdminStartupsComplete from "./pages/admin/AdminStartupsComplete";
import AdminUsersComplete from "./pages/admin/AdminUsersComplete";
import BlogListing from "./pages/BlogListing";
import BlogDetail from "./pages/BlogDetail";
import Gallery from "./pages/Gallery";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminGalleryComplete from "./pages/admin/AdminGalleryComplete";
import ContactPage from "./pages/ContactPage";

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
              {/* Admin Login - No Layout */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin Routes with AdminLayout */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Routes>
                        {/* Main Dashboard */}
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="/dashboard" element={<AdminDashboard />} />

                        {/* Events Management */}
                        <Route
                          path="/dashboard/events"
                          element={
                            <ProtectedRoute requiredPermission="manage_events">
                              <AdminEventsComplete />
                            </ProtectedRoute>
                          }
                        />

                        {/* Startups Management */}
                        <Route
                          path="/dashboard/startups"
                          element={
                            <ProtectedRoute requiredPermission="manage_content">
                              <AdminStartupsComplete />
                            </ProtectedRoute>
                          }
                        />

                        {/* Blog Management */}
                        <Route
                          path="/dashboard/blogs"
                          element={
                            <ProtectedRoute requiredPermission="manage_content">
                              <AdminBlogsComplete />
                            </ProtectedRoute>
                          }
                        />

                        {/* User Management */}
                        <Route
                          path="/dashboard/users"
                          element={
                            <ProtectedRoute requiredPermission="manage_users">
                              <AdminUsersComplete />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/dashboard/gallery"
                          element={
                            <ProtectedRoute requiredPermission="manage_users">
                              <AdminGalleryComplete />
                            </ProtectedRoute>
                          }
                        />

                        {/* Fallback for admin routes */}
                        <Route path="*" element={<AdminDashboard />} />
                      </Routes>
                    </AdminLayout>
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
                      <Route path="/contact" element={<ContactPage />} />
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
