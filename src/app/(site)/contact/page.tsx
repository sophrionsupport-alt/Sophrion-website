import { Suspense } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Linkedin, Instagram } from "lucide-react";

import InquiryForm from "@/components/forms/InquiryForm";
import ContactFaqAccordion from "@/components/marketing/ContactFaqAccordion";
import MarketingSectionHeader from "@/components/marketing/MarketingSectionHeader";
import FeatureGrid from "@/components/marketing/FeatureGrid";
import MarketingShell from "@/components/marketing/MarketingShell";

import { MARKETING } from "@/lib/marketing/links";

import {
  marketingContainerClass,
  marketingHeroClass,
  marketingHeroSectionYClass,
} from "@/lib/marketing/layout";

function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function ContactCard({
  title,
  body,
  href,
  label,
}: {
  title: string;
  body: string;
  href: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/3 p-5 backdrop-blur">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>

      <p className="mt-2 text-sm text-foreground/70">{body}</p>

      <Link
        href={href}
        className="mt-4 inline-flex text-sm font-semibold text-[hsl(var(--cyan-500))] underline-offset-4 hover:underline"
      >
        {label}
      </Link>
    </div>
  );
}

export default function ContactPage() {
  const partnership = [
    {
      title: "Institutional Partnerships",
      body: "AI readiness initiatives, pathway systems, residency ecosystems, and innovation-focused learning environments.",
    },
    {
      title: "Innovation Programs",
      body: "Hackathons, workshops, execution systems, and interdisciplinary innovation initiatives.",
    },
    {
      title: "Residency Ecosystems",
      body: "Startup-style execution environments, sprint workflows, and production-oriented learning systems.",
    },
    {
      title: "Talent Ecosystems",
      body: "Recruiter engagement, showcase systems, portfolio visibility, and hiring opportunities.",
    },
    {
      title: "Workshops & Learning Initiatives",
      body: "AI-native productivity, engineering modernization, execution systems, and future-ready workforce programs.",
    },
    {
      title: "Mentor Networks",
      body: "Technical mentorship, execution reviews, innovation guidance, and collaborative support ecosystems.",
    },
  ];

  return (
    <MarketingShell>
      <div className={cn(marketingContainerClass, marketingHeroSectionYClass)}>
        <div className={marketingHeroClass}>
          <p className="text-sm font-semibold tracking-wide text-foreground/70">
            CONTACT SOPHRION
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="bg-linear-to-l from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))] bg-clip-text text-transparent">
              Let’s Build Future-Ready Ecosystems Together
            </span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-foreground/75 sm:text-xl">
            Connect with Sophrion for institutional partnerships, student
            pathways, residency programs, innovation collaborations, AI
            readiness initiatives, and future-focused learning ecosystems.
          </p>

          <p className="mt-6 text-sm text-foreground/55">
            Built for students, institutions, innovation ecosystems, and the
            future workforce.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`${MARKETING.contact}?topic=partnership`}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
              style={{
                background:
                  "linear-gradient(90deg, hsl(var(--brand-600)), hsl(var(--cyan-500)))",
              }}
            >
              Partner With Sophrion
            </Link>

            <Link
              href={MARKETING.join}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/3 px-4 py-2.5 text-sm font-semibold text-foreground/85 backdrop-blur hover:bg-white/6"
            >
              Join Ecosystem
            </Link>
          </div>
        </div>

        <section className="mt-20">
          <MarketingSectionHeader
            eyebrow="GET IN TOUCH"
            title="Connect With The Sophrion Ecosystem"
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <ContactCard
              title="Institutional Partnerships"
              body="For colleges, universities, innovation cells, incubation centers, and ecosystem collaborations."
              href={`${MARKETING.contact}?topic=partnership`}
              label="Partnership Inquiry →"
            />

            <ContactCard
              title="Student Ecosystem"
              body="For students interested in pathways, projects, residencies, and execution-focused learning."
              href={`${MARKETING.contact}?topic=student`}
              label="Student Inquiry →"
            />

            <ContactCard
              title="Mentors & Collaborators"
              body="For mentors, technical experts, industry professionals, and ecosystem contributors."
              href={`${MARKETING.contact}?topic=mentor`}
              label="Collaborate With Us →"
            />

            <ContactCard
              title="Industry & Recruiters"
              body="For hiring collaborations, showcase opportunities, and talent ecosystem partnerships."
              href={`${MARKETING.contact}?topic=industry`}
              label="Industry Inquiry →"
            />
          </div>
        </section>

        <section className="mt-20 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <MarketingSectionHeader
              eyebrow="SEND AN INQUIRY"
              title="Start The Conversation"
            />

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/3 p-5 backdrop-blur sm:p-7">
              <Suspense
                fallback={
                  <div className="text-sm text-foreground/60">
                    Loading form…
                  </div>
                }
              >
                <InquiryForm />
              </Suspense>
            </div>

            <div className="mt-10 space-y-4">
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/3 p-4 backdrop-blur">
                <Mail className="mt-0.5 h-5 w-5 text-foreground/70" />

                <div>
                  <div className="text-sm font-medium text-foreground">
                    Email
                  </div>

                  <a
                    href="mailto:contact@sophrion.in"
                    className="text-sm text-[hsl(var(--cyan-500))] hover:underline"
                  >
                    contact@sophrion.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/3 p-4 backdrop-blur">
                <Phone className="mt-0.5 h-5 w-5 text-foreground/70" />

                <div>
                  <div className="text-sm font-medium text-foreground">
                    Phone
                  </div>

                  <div className="text-sm text-foreground/70">
                    8639998768
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/3 p-4 backdrop-blur">
                <MapPin className="mt-0.5 h-5 w-5 text-foreground/70" />

                <div>
                  <div className="text-sm font-medium text-foreground">
                    Location
                  </div>

                  <div className="text-sm text-foreground/70">
                    Hyderabad, India
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4 text-sm text-foreground/60">
              <a
                href="https://www.linkedin.com/in/sophrion/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-[hsl(var(--cyan-500))]"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>

              <a
                href="https://www.instagram.com/sophrion_private_limited/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-[hsl(var(--cyan-500))]"
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </a>
            </div>
          </div>

          <div>
            <MarketingSectionHeader
              eyebrow="COLLABORATION OPPORTUNITIES"
              title="Ways To Collaborate With Sophrion"
            />

            <div className="mt-8">
              <FeatureGrid
                items={partnership.map((p) => ({
                  title: p.title,
                  body: p.body,
                }))}
                columns={2}
              />
            </div>
          </div>
        </section>

        <section className="mt-24">
          <MarketingSectionHeader
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            align="center"
          />

          <div className="mt-10">
            <ContactFaqAccordion />
          </div>
        </section>

        <section className="mt-24 rounded-3xl border border-white/10 bg-white/3 p-8 text-center backdrop-blur">
          <h2 className="text-2xl font-semibold text-foreground">
            Building The Future Of Execution-Driven Learning
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-foreground/70">
            Sophrion combines AI-native workflows, collaborative production
            systems, execution-oriented learning environments, and innovation
            ecosystems into a unified future-ready platform.
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-xs text-foreground/55">
            Whether you are a student, institution, mentor, or collaborator —
            Sophrion is designed to help build the next generation of
            execution-ready talent ecosystems.
          </p>
        </section>
      </div>
    </MarketingShell>
  );
}