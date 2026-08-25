import type { Metadata, Viewport } from "next";
import Script from "next/script";
import Providers from "./providers";
import "./globals.css";

const SITE_URL = "https://ecellipsacademy.in";
const TITLE =
  "E-Cell IPSA | Entrepreneurship Cell IPS Academy Indore | Startup Incubation & Innovation Hub";
const DESCRIPTION =
  "Join E-Cell IPSA - Premier Entrepreneurship Cell at IPS Academy Indore. We foster innovation, provide startup incubation, mentorship programs, and create successful entrepreneurs. Explore events, workshops, and funding opportunities.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "E-Cell IPSA",
    "Entrepreneurship Cell",
    "IPS Academy",
    "Startup Incubation",
    "Innovation Hub",
    "Entrepreneur",
    "Indore Startups",
    "Business Development",
    "Mentorship",
    "Funding",
    "Venture Capital",
    "Student Entrepreneurs",
  ],
  authors: [{ name: "E-Cell IPS Academy" }],
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "E-Cell IPSA | Entrepreneurship Cell IPS Academy Indore",
    description:
      "Premier Entrepreneurship Cell at IPS Academy Indore fostering innovation, startup incubation, and creating successful entrepreneurs through mentorship and funding opportunities.",
    siteName: "E-Cell IPSA",
    locale: "en_IN",
    images: [
      {
        url: "/EcellLogo.png",
        width: 1200,
        height: 630,
        alt: "E-Cell IPSA Logo - Entrepreneurship Cell IPS Academy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Cell IPSA | Entrepreneurship Cell IPS Academy Indore",
    description:
      "Premier Entrepreneurship Cell fostering innovation, startup incubation, and entrepreneurship at IPS Academy Indore. Join our community of innovators!",
    images: ["/EcellLogo.png"],
    site: "@ecell_ips",
    creator: "@ecell_ips",
  },
  icons: {
    icon: [{ url: "/EcellLogo.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/EcellLogo.png" }],
    shortcut: "/EcellLogo.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#8B5CF6",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "E-Cell IPS Academy",
  alternateName: ["E-Cell IPSA", "Entrepreneurship Cell IPS Academy"],
  url: SITE_URL,
  logo: "/EcellLogo.png",
  description:
    "Premier Entrepreneurship Cell at IPS Academy Indore fostering innovation, startup incubation, and creating successful entrepreneurs.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "IPS Academy Campus, Knowledge Village",
    addressLocality: "Indore",
    addressRegion: "Madhya Pradesh",
    postalCode: "452012",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-731-2570631",
    contactType: "Customer Service",
    email: "ecell@ipsacademy.org",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },
  sameAs: [
    "https://facebook.com/ecell.ips.academy",
    "https://linkedin.com/company/ecell-ips-academy",
    "https://twitter.com/ecell_ips",
    "https://instagram.com/ecell_ips",
    "https://youtube.com/@ecellips",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body itemScope itemType="https://schema.org/WebPage">
        <a
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2"
          href="#main-content"
        >
          Skip to main content
        </a>
        <div id="root" role="main" aria-label="E-Cell IPSA Main Application">
          <Providers>{children}</Providers>
        </div>
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </body>
    </html>
  );
}
