// Public API for the startups feature.
export { StartupsAdminPage } from "./StartupsAdminPage";
export { useStartups, useFeaturedStartups } from "./hooks/useStartups";
export { useAdminStartups } from "./hooks/useAdminStartups";
export {
  listActiveStartups,
  listFeaturedStartups,
  listStartups,
  createStartup,
  updateStartup,
  deleteStartup,
  computeStats,
} from "./startupsService";
export * from "./types";
