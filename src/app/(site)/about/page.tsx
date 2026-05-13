import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import FeatureGrid from "@/components/marketing/FeatureGrid";
import MarketingSectionHeader from "@/components/marketing/MarketingSectionHeader";
import { MARKETING } from "@/lib/marketing/links";

import { marketingContainerClass, marketingHeroClass, marketingHeroSectionYClass } from "@/lib/marketing/layout";

export default function Page() {
  const problemGrid = [
    { title: "Weak Practical Exposure", body: "Students often graduate without production experience or deployable project systems." },
    { title: "Limited Portfolio Visibility", body: "Traditional systems rarely help students build visible proof-of-work ecosystems." },
    { title: "Outdated Workflow Systems", body: "Modern industry workflows evolve rapidly while curriculum systems adapt slowly." },
    { title: "AI Transformation Pressure", body: "Artificial intelligence is reshaping every major industry and workforce category." },
    { title: "Execution Readiness Gap", body: "Companies increasingly seek contributors capable of building, collaborating, and adapting quickly." },
    { title: "Innovation Infrastructure Gap", body: "Institutions require future-ready ecosystems capable of supporting modern workforce transformation." },
  ];

  const philosophy = [
    { title: "Production-Oriented Learning", body: "Students build real systems instead of relying only on theoretical exercises." },
    { title: "AI-Native Workflows", body: "Intelligent productivity systems, automation tools, and AI-assisted workflows." },
    { title: "Startup-Style Execution", body: "Sprint systems, collaborative squads, accountability workflows, and execution culture." },
    { title: "Public Proof-Of-Work", body: "Projects, GitHub repositories, deployed systems, portfolios, and visible contribution history." },
    { title: "Interdisciplinary Collaboration", body: "Students work across AI, engineering, analytics, design, operations, and infrastructure systems." },
    { title: "Continuous Adaptability", body: "Preparation for rapidly evolving intelligent workforce environments." },
  ];

  const differentiators = [
    { title: "Execution-First Ecosystem", body: "Practical capability, collaborative execution, and deployable outputs." },
    { title: "AI-Native Infrastructure", body: "Intelligent workflows, AI productivity, automation systems, and modern operational environments." },
    { title: "Residency-Based Learning", body: "Production-oriented residency systems simulate real execution ecosystems." },
    { title: "Squad-Based Collaboration", body: "Interdisciplinary teams with structured execution systems." },
    { title: "Future-Ready Pathways", body: "Domains aligned with AI, intelligent systems, cloud infrastructure, engineering modernization, and innovation ecosystems." },
    { title: "Portfolio-Driven Validation", body: "Visible proof-of-work replaces purely certificate-driven validation systems." },
  ];

  return (
    <div className="relative flex flex-col bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[18%] top-[12%] h-225 w-225 rounded-full bg-[radial-gradient(closest-side,hsl(var(--ring)/0.22),transparent_70%)]" />
        <div className="absolute right-[10%] top-[28%] h-225 w-225 rounded-full bg-[radial-gradient(closest-side,hsl(var(--cyan-500)/0.14),transparent_70%)]" />
      </div>

      {/* 1 Hero */}

      <section className={marketingHeroSectionYClass}>
        <div className={marketingContainerClass}>
          <div
            className={marketingHeroClass}
          >
            <p className="text-sm font-semibold tracking-wide text-foreground/70">ABOUT SOPHRION</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-sm font-semibold tracking-wide text-foreground/70">ABOUT SOPHRION</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">

              <span className="bg-linear-to-l from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))] bg-clip-text text-transparent">
                Redefining Career Acceleration For The AI Era
              </span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-foreground/75 sm:text-xl">
              Sophrion is an AI-native career acceleration and innovation ecosystem designed to bridge the growing gap
              between academic learning and real-world execution through production-oriented systems, collaborative workflows,
              and future-ready learning environments.
            </p>
            <p className="mt-6 text-sm text-foreground/55">
              Built for students, institutions, innovation ecosystems, and the intelligent economy of the future.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">

            <p className="mt-5 text-lg leading-relaxed text-foreground/70">
              Sophrion is an AI-native career acceleration and innovation ecosystem designed to bridge the growing gap
              between academic learning and real-world execution through production-oriented systems, collaborative workflows,
              and future-ready learning environments.
            </p>
            <p className="mt-4 text-sm text-foreground/55">
              Built for students, institutions, innovation ecosystems, and the intelligent economy of the future.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">

              <Link
                href={MARKETING.ecosystem}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
                style={{
                  background: "linear-gradient(90deg, hsl(var(--brand-600)), hsl(var(--cyan-500)))",
                }}
              >
                Explore Ecosystem
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={MARKETING.institutions}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/3 px-4 py-2.5 text-sm font-semibold text-foreground/85 backdrop-blur-sm transition hover:bg-white/5"
              >
                Partner With Sophrion
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2 Why exists */}
      <section className="border-t border-white/10 py-16 sm:py-20">

        <div className={marketingContainerClass}>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <MarketingSectionHeader
            eyebrow="OUR PURPOSE"
            title="Why Sophrion Exists"
            subtitle="Modern education systems were built for a different era. While industries rapidly evolve through artificial intelligence, automation, intelligent infrastructure, and digital transformation, most students still graduate through systems heavily centered around theoretical learning, outdated workflows, and certificate-driven validation."
          />
          <div className="mt-8 max-w-3xl space-y-4 text-foreground/75">
            <p>This creates a growing disconnect between education and employability, learning and execution, and talent availability versus workforce readiness.</p>
            <p>
              Sophrion was created to bridge this gap through an execution-first ecosystem designed for the future workforce.
              The ecosystem transforms students from passive learners into execution-ready contributors through AI-native
              workflows, collaborative production systems, startup-style execution culture, and deployable proof-of-work environments.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Structural problem */}
      <section className="py-16 sm:py-20">

        <div className={marketingContainerClass}>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <MarketingSectionHeader
            eyebrow="THE CHALLENGE"
            title="The Workforce Is Changing Faster Than Traditional Learning Systems"
            subtitle="Modern industries increasingly require professionals capable of operating inside collaborative, AI-assisted, execution-driven environments. However, many traditional systems still rely heavily on theoretical instruction, isolated learning, outdated workflows, and limited real-world exposure."
          />
          <FeatureGrid className="mt-12" items={problemGrid} columns={3} />
        </div>
      </section>

      {/* 4 Vision */}
      <section className="border-t border-white/10 py-16 sm:py-20">

        <div className={marketingContainerClass}>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <MarketingSectionHeader
            eyebrow="OUR VISION"
            title="Building Future-Ready Execution Ecosystems"
          />
          <div className="mt-8 max-w-3xl space-y-4 text-foreground/75">
            <p>Sophrion envisions a future where students graduate with visible proof-of-work instead of only certificates, institutions function as innovation ecosystems instead of static learning environments, and industries gain access to execution-ready talent trained through real production systems.</p>
            <p>
              The ecosystem combines AI-native learning systems, startup-style execution culture, interdisciplinary collaboration,
              production-oriented residency environments, and deployable project ecosystems into unified career acceleration infrastructure.
              Sophrion is designed not as a conventional edtech platform, but as a scalable ecosystem for intelligent workforce development and future-ready talent transformation.
            </p>
          </div>
        </div>
      </section>

      {/* 5 Philosophy */}
      <section className="py-16 sm:py-20">

        <div className={marketingContainerClass}>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <MarketingSectionHeader
            eyebrow="OUR PHILOSOPHY"
            title="Learn By Building. Grow Through Execution."
            subtitle="Sophrion replaces passive learning with production-oriented execution systems where students actively participate in building, deploying, collaborating, and contributing inside structured environments."
            align="center"
          />
          <FeatureGrid className="mt-12" items={philosophy} columns={3} />
        </div>
      </section>

      {/* 6 Differentiators */}
      <section className="border-t border-white/10 py-16 sm:py-20">

        <div className={marketingContainerClass}>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <MarketingSectionHeader
            eyebrow="WHY SOPHRION"
            title="More Than A Traditional Learning Platform"
            align="center"
          />
          <FeatureGrid className="mt-12" items={differentiators} columns={3} />
        </div>
      </section>

      {/* 7 Founder */}
      <section className="py-16 sm:py-20">

        <div className={marketingContainerClass}>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >

              <p className="text-sm font-semibold tracking-wide text-foreground/70">FOUNDER & VISION ARCHITECT</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Srikanth Molugu</h2>
              <p className="mt-5 leading-relaxed text-foreground/75">
                Srikanth Molugu is an entrepreneur and ecosystem builder focused on creating future-ready systems at the intersection of education, artificial intelligence, innovation, and execution-driven workforce development.

              </p>
              <p className="mt-4 leading-relaxed text-foreground/75">
                As the founder of Sophrion, he is building an AI-native ecosystem designed to help students transition from passive learning into real execution environments through production systems, collaborative workflows, and future-oriented career acceleration pathways.
              </p>
            </div>
            <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-border bg-white/3 p-8 backdrop-blur">
              <Sparkles className="h-14 w-14 text-[hsl(var(--cyan-500))]" aria-hidden />
            </div>
          </div>
        </div>
      </section>

      {/* 8 Long-term vision */}
      <section className="border-t border-white/10 py-16 sm:py-20">
        <div className={marketingContainerClass}>
          <MarketingSectionHeader eyebrow="THE FUTURE" title="Building Infrastructure For The Intelligent Economy" />
          <div className="mt-8 max-w-3xl space-y-4 text-foreground/75">
            <p>
              Sophrion is designed to evolve into a scalable ecosystem powering AI-native workforce development, intelligent learning systems,
              innovation ecosystems, execution-oriented career acceleration, and future-ready talent infrastructure.
            </p>
            <p>
              The long-term mission is to help build a generation of intelligent builders, adaptive engineers, AI-native professionals,
              execution-focused innovators, and future-ready contributors capable of thriving in rapidly evolving technological ecosystems.
            </p>

              </p>
              <p className="mt-4 leading-relaxed text-foreground/75">
                As the founder of Sophrion, he is building an AI-native ecosystem designed to help students transition from passive learning into real execution environments through production systems, collaborative workflows, and future-oriented career acceleration pathways.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex min-h-[220px] items-center justify-center rounded-3xl border border-border bg-white/3 p-8 backdrop-blur"
            >
              <Sparkles className="h-14 w-14 text-[hsl(var(--cyan-500))]" aria-hidden />
            </motion.div>

          </div>
        </div>
      </section>


      {/* 9 Final CTA */}
      <section className="py-16 sm:pb-24">
        <div className={marketingContainerClass}>

      {/* 8 Long-term vision */}
      <section className="border-t border-white/10 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader eyebrow="THE FUTURE" title="Building Infrastructure For The Intelligent Economy" />
          <div className="mt-8 max-w-3xl space-y-4 text-foreground/75">
            <p>
              Sophrion is designed to evolve into a scalable ecosystem powering AI-native workforce development, intelligent learning systems,
              innovation ecosystems, execution-oriented career acceleration, and future-ready talent infrastructure.
            </p>
            <p>
              The long-term mission is to help build a generation of intelligent builders, adaptive engineers, AI-native professionals,
              execution-focused innovators, and future-ready contributors capable of thriving in rapidly evolving technological ecosystems.
            </p>
          </div>
        </div>
      </section>

      {/* 9 Final CTA */}
      <section className="py-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Build Beyond Traditional Education</h2>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                  Join an AI-native execution ecosystem designed for the future workforce, intelligent systems, and innovation-driven careers.
                </p>
                <p className="mt-4 text-xs text-foreground/55">
                  Sophrion combines learning, execution, AI-native workflows, production systems, and innovation culture into a unified future-ready ecosystem.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={MARKETING.ecosystem}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
                  style={{ background: "linear-gradient(90deg, hsl(var(--brand-600)), hsl(var(--cyan-500)))" }}
                >
                  Explore Ecosystem
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={MARKETING.institutions}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/3 px-4 py-2.5 text-sm font-semibold text-foreground/85 backdrop-blur-sm transition hover:bg-white/5"
                >
                  Partner With Sophrion
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
