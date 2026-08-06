// Public API for the certificates feature.
export { CertEventsAdminPage } from "./CertEventsAdminPage";
export { CertEventManagePage } from "./CertEventManagePage";
export {
  listCertEvents,
  getCertEvent,
  createCertEvent,
  updateCertEventDetails,
  updateCertEventTemplate,
  updateCertEventFields,
  deleteCertEvent,
} from "./certEventsService";
export {
  generateCertificateId,
  issueCertificates,
  listCertificatesForEvent,
  deleteCertificate,
  deleteCertificatesForEvent,
  lookupCertificateForDownload,
  verifyCertificate,
} from "./certificatesService";
export type { IssueCertificateRow } from "./certificatesService";
export { generateCertificatePdf, downloadCertificatePdf } from "./pdfGenerator";
export * from "./types";
