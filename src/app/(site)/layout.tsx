import type { Metadata, Viewport } from "next";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import FooterCtaStrip from "@/components/layout/FooterCtaStrip";
import AnimatedBackground from "@/components/ui/AnimatedBackground";

const SITE_NAME = "Sophrion";
const SITE_URL = "https://sophrion.in";
const DEFAULT_TITLE = "Sophrion - Future Within";
const DEFAULT_DESCRIPTION =
  "Sophrion is an Institutional Readiness Intelligence System that helps colleges and students align outcomes with industry expectations through structured readiness pathways, measurable reporting, and scalable campus-industry bridge infrastructure.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0b10",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s - Sophrion`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    locale: "en_IN",
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
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/og.jpg"],
  },
  formatDetection: { email: false, address: false, telephone: false },
  category: "Education",
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />

      <SiteHeader />
      <main className="mx-auto w-full flex-1">{children}</main>
      <FooterCtaStrip />
      <SiteFooter />
    </div>
  );
}