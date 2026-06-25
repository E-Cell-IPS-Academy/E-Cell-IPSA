import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ECellLoader from "./components/core/Loader";
import Navbar from "./components/core/Navbar";
import Footer from "./components/core/Footer";

// Public Pages
import HomePage from "./pages/HomePage";
import PastEventsPage from "./pages/PastEventsPage";
import StartupOfWeek from "./pages/StartupOfWeek";
import BlogListing from "./pages/BlogListing";
import BlogDetail from "./pages/BlogDetail";
import Gallery from "./pages/Gallery";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import TeamPage from "./pages/TeamPage";

// Program Pages
import IncubationPage from "./pages/IncubationPage";
import MentorshipPage from "./pages/MentorshipPage";
import WorkshopsPage from "./pages/WorkshopsPage";
import CompetitionsPage from "./pages/CompetitionsPage";
import FundingPage from "./pages/FundingPage";

// Resource Pages
import ResourcesPage from "./pages/ResourcesPage";
import FAQPage from "./pages/FAQPage";
import AlumniPage from "./pages/AlumniPage";

// Legal Pages
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import ConductPage from "./pages/ConductPage";

// Auth Pages
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import UserDashboard from "./pages/UserDashboard";

// Special Pages
import StartupRegistration from "./pages/VypaarXPage";
import HiringResponses from "./pages/ResponsePage";
import IgniteXRegistration from "./pages/IgniteX";

// Admin
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEventsComplete from "./pages/admin/AdminEvents";
import AdminBlogsComplete from "./pages/admin/AdminBlogsComplete";
import AdminStartupsComplete from "./pages/admin/AdminStartupsComplete";
import AdminUsersComplete from "./pages/admin/AdminUsersComplete";
import AdminGalleryComplete from "./pages/admin/AdminGalleryComplete";
import AdminTeamManagement from "./pages/admin/AdminTeamManagement";
import AdminHeroManagement from "./pages/admin/AdminHeroManagement";
import AdminAboutManagement from "./pages/admin/AdminAboutManagement";
import AdminContactManagement from "./pages/admin/AdminContactManagement";
import AdminSiteSettings from "./pages/admin/AdminSiteSettings";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";

const App: React.FC = () => {
  const [showLoader, setShowLoader] = useState<boolean>(true);

  const handleLoaderComplete = (): void => {
    setShowLoader(false);
  };

  return (
    <>
      {showLoader && <ECellLoader onComplete={handleLoaderComplete} />}

      {!showLoader && (
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <Routes>
                {/* Admin Login */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Admin Routes */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute>
                      <AdminLayout>
                        <Routes>
                          <Route path="/" element={<AdminDashboard />} />
                          <Route
                            path="/dashboard"
                            element={<AdminDashboard />}
                          />

                          <Route
                            path="/dashboard/events"
                            element={
                              <ProtectedRoute requiredPermission="manage_events">
                                <AdminEventsComplete />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/dashboard/startups"
                            element={
                              <ProtectedRoute requiredPermission="manage_content">
                                <AdminStartupsComplete />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/dashboard/blogs"
                            element={
                              <ProtectedRoute requiredPermission="manage_content">
                                <AdminBlogsComplete />
                              </ProtectedRoute>
                            }
                          />
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
                              <ProtectedRoute requiredPermission="manage_content">
                                <AdminGalleryComplete />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/dashboard/team"
                            element={
                              <ProtectedRoute requiredPermission="manage_content">
                                <AdminTeamManagement />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/dashboard/hero"
                            element={
                              <ProtectedRoute requiredPermission="manage_content">
                                <AdminHeroManagement />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/dashboard/about"
                            element={
                              <ProtectedRoute requiredPermission="manage_content">
                                <AdminAboutManagement />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/dashboard/contact"
                            element={
                              <ProtectedRoute requiredPermission="manage_content">
                                <AdminContactManagement />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/dashboard/settings"
                            element={
                              <ProtectedRoute requiredPermission="manage_settings">
                                <AdminSiteSettings />
                              </ProtectedRoute>
                            }
                          />

                          <Route path="*" element={<AdminDashboard />} />
                        </Routes>
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Auth Routes */}
                <Route path="/login" element={<UserLogin />} />
                <Route path="/signup" element={<UserSignup />} />
                <Route path="/register" element={<StartupRegistration />} />
                <Route path="/response" element={<HiringResponses />} />

                {/* User Dashboard */}
                <Route
                  path="/dashboard"
                  element={
                    <div className="min-h-screen bg-[var(--bg-primary)]">
                      <Navbar />
                      <UserDashboard />
                      <Footer />
                    </div>
                  }
                />

                {/* Public Routes */}
                <Route
                  path="/*"
                  element={
                    <div className="min-h-screen bg-[var(--bg-primary)]">
                      <Navbar />
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/team" element={<TeamPage />} />
                        <Route
                          path="/past-events"
                          element={<PastEventsPage />}
                        />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/blog" element={<BlogListing />} />
                        <Route path="/blog/:slug" element={<BlogDetail />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/startup" element={<StartupOfWeek />} />
                        <Route
                          path="/hiring"
                          element={<IgniteXRegistration />}
                        />

                        {/* Programs */}
                        <Route
                          path="/incubation"
                          element={<IncubationPage />}
                        />
                        <Route
                          path="/mentorship"
                          element={<MentorshipPage />}
                        />
                        <Route path="/workshops" element={<WorkshopsPage />} />
                        <Route
                          path="/competitions"
                          element={<CompetitionsPage />}
                        />
                        <Route path="/funding" element={<FundingPage />} />

                        {/* Resources */}
                        <Route path="/resources" element={<ResourcesPage />} />
                        <Route path="/faq" element={<FAQPage />} />
                        <Route path="/alumni" element={<AlumniPage />} />

                        {/* Legal */}
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/conduct" element={<ConductPage />} />
                      </Routes>
                      <Footer />
                    </div>
                  }
                />
              </Routes>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      )}
    </>
  );
};

export default App;
