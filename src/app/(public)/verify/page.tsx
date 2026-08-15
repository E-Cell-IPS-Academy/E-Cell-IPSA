import { Suspense } from "react";
import CertificateVerifyPage from "@/screens/CertificateVerifyPage";

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <CertificateVerifyPage />
    </Suspense>
  );
}
