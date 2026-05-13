
// src/app/(site)/page.tsx
import type { Metadata } from "next";
import HomeMarketing from "@/components/marketing/pages/HomeMarketing";

const SITE_NAME = "Sophrion";
const SITE_URL = "https://sophrion.in";

const PAGE_TITLE = "AI-Native Execution Ecosystem For Future-Ready Talent";

const PAGE_DESCRIPTION =
  "Sophrion transforms students into execution-ready professionals through production-oriented learning, startup-style collaboration, AI-native workflows, and deployable proof-of-work systems.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${PAGE_TITLE} | ${SITE_NAME}`,
    description: PAGE_DESCRIPTION,
    url: SITE_URL,
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — OG Image`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${PAGE_TITLE} | ${SITE_NAME}`,
    description: PAGE_DESCRIPTION,
    images: ["/og.jpg"],
  },
};

function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}#org`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/icon.png`,
        sameAs: [],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}#org` },
        inLanguage: "en-IN",
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}#home`,
        url: SITE_URL,
        name: `${PAGE_TITLE} | ${SITE_NAME}`,
        description: PAGE_DESCRIPTION,
        isPartOf: { "@id": `${SITE_URL}#website` },
        about: { "@id": `${SITE_URL}#org` },
        inLanguage: "en-IN",
      },
    ],
  };
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />
      <HomeMarketing />
    </>
  );
}
