
// src/app/(site)/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

const SITE_NAME = "Sophrion";
const SITE_URL = "https://sophrion.in";

const PAGE_TITLE = "Institutional Readiness Intelligence System";

const PAGE_DESCRIPTION =
  "Sophrion helps colleges and students build measurable readiness for placements and early careers through structured pathways and practical reporting—built as campus-industry bridge infrastructure.";

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
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />

      {/* HERO */}
      <header className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-sm uppercase tracking-widest text-foreground/60">
          Future Within
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          {PAGE_TITLE}
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground/80">
          Sophrion is a{" "}
          <span className="font-semibold text-foreground">
            Campus-Industry Bridge Infrastructure
          </span>{" "}
          that turns readiness into something measurable, trackable, and
          scalable—for institutions and students.
        </p>

        
      </header>

      {/* WHAT SOPHRION DOES */}
      <section className="mx-auto max-w-5xl px-6 pb-12">
        <div className="grid gap-6 rounded-2xl border border-foreground/10 bg-foreground/5 p-6">
          <h2 id="what-we-do" className="text-xl font-semibold">
            What Sophrion does
          </h2>

          <ul className="grid gap-3 text-foreground/85">
            <li>
              <span className="font-semibold text-foreground">
                Structured readiness pathways
              </span>{" "}
              for students that map skills → outcomes → proof.
            </li>

            <li>
              <span className="font-semibold text-foreground">
                Institutional reporting
              </span>{" "}
              that placement teams can review quickly and act on.
            </li>

            <li>
              <span className="font-semibold text-foreground">
                Bridge workflows
              </span>{" "}
              that connect campuses to industry-aligned programs and
              opportunities.
            </li>
          </ul>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="mx-auto max-w-5xl px-6 pb-12">
        <div className="grid gap-3 rounded-2xl border border-foreground/10 bg-foreground/5 p-6">
          <h2 id="who-its-for" className="text-xl font-semibold">
            Who it’s for
          </h2>

          <p className="text-foreground/85">
            Students who want clarity on what to do next, and colleges who
            need a scalable system to improve placement readiness with
            measurable visibility.
          </p>
        </div>
      </section>

      {/* NEXT STEPS */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid gap-4 rounded-2xl border border-foreground/10 bg-foreground/5 p-6">
          <h2 id="next-steps" className="text-xl font-semibold">
            Next steps
          </h2>

          <p className="text-foreground/85">
            Explore the student and college pathways, check upcoming
            events, or reach out.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/students"
              className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              Student pathway
            </Link>

            <Link
              href="/colleges"
              className="rounded-xl border border-foreground/15 px-4 py-2 text-sm text-foreground/90 hover:bg-foreground/10"
            >
              College partnership
            </Link>

            <Link
              href="/events"
              className="rounded-xl border border-foreground/15 px-4 py-2 text-sm text-foreground/90 hover:bg-foreground/10"
            >
              Upcoming events
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

