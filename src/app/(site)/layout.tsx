import type { Metadata, Viewport } from "next";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

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
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(900px circle at 20% 10%, hsl(var(--ring) / 0.18), transparent 55%)," +
            "radial-gradient(900px circle at 80% 35%, hsl(var(--cyan-500) / 0.14), transparent 55%)",
        }}
      />

      <SiteHeader />
      <main className="mx-auto w-full flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}