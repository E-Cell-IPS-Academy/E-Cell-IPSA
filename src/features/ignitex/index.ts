// Public API for the IgniteX 3.O feature (independent of VyaparX).
export { useIgnitexSettings } from "./hooks/useIgnitexSettings";
export {
  submitSpeakerRegistration,
  listSpeakerRegistrations,
  getIgnitexSettings,
  saveIgnitexSettings,
  registrationsToCsv,
  downloadCsv,
  DuplicateRegistrationError,
} from "./ignitexService";
export * from "./types";
