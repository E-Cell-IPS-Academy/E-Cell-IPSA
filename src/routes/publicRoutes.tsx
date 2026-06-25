import type { RouteConfig } from "./types";

// Public pages
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import TeamPage from "../pages/TeamPage";
import PastEventsPage from "../pages/PastEventsPage";
import Gallery from "../pages/Gallery";
import BlogListing from "../pages/BlogListing";
import BlogDetail from "../pages/BlogDetail";
import ContactPage from "../pages/ContactPage";
import StartupOfWeek from "../pages/StartupOfWeek";
import IgniteXRegistration from "../pages/IgniteX";

// Program pages
import IncubationPage from "../pages/IncubationPage";
import MentorshipPage from "../pages/MentorshipPage";
import WorkshopsPage from "../pages/WorkshopsPage";
import CompetitionsPage from "../pages/CompetitionsPage";
import FundingPage from "../pages/FundingPage";

// Resource pages
import ResourcesPage from "../pages/ResourcesPage";
import FAQPage from "../pages/FAQPage";
import AlumniPage from "../pages/AlumniPage";

// Legal pages
import PrivacyPage from "../pages/PrivacyPage";
import TermsPage from "../pages/TermsPage";
import ConductPage from "../pages/ConductPage";

/**
 * Public-facing routes (rendered inside the Navbar/Footer layout).
 * Paths are relative to the public "/*" mount point in AppRoutes.
 */
export const publicRoutes: RouteConfig[] = [
  { path: "/", element: <HomePage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/team", element: <TeamPage /> },
  { path: "/past-events", element: <PastEventsPage /> },
  { path: "/gallery", element: <Gallery /> },
  { path: "/blog", element: <BlogListing /> },
  { path: "/blog/:slug", element: <BlogDetail /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/startup", element: <StartupOfWeek /> },
  { path: "/hiring", element: <IgniteXRegistration /> },

  // Programs
  { path: "/incubation", element: <IncubationPage /> },
  { path: "/mentorship", element: <MentorshipPage /> },
  { path: "/workshops", element: <WorkshopsPage /> },
  { path: "/competitions", element: <CompetitionsPage /> },
  { path: "/funding", element: <FundingPage /> },

  // Resources
  { path: "/resources", element: <ResourcesPage /> },
  { path: "/faq", element: <FAQPage /> },
  { path: "/alumni", element: <AlumniPage /> },

  // Legal
  { path: "/privacy", element: <PrivacyPage /> },
  { path: "/terms", element: <TermsPage /> },
  { path: "/conduct", element: <ConductPage /> },
];
