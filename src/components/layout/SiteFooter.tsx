import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "@/components/forms/NewsletterForm";
import { MARKETING, PATHWAY_ANCHORS } from "@/lib/marketing/links";

type Props = {
  className?: string;
};

const ecosystemLinks = [
  { href: MARKETING.about, label: "About" },
  { href: MARKETING.ecosystem, label: "Ecosystem" },
  { href: MARKETING.pathways, label: "Pathways" },
  { href: MARKETING.residency, label: "Residency" },
  { href: MARKETING.institutions, label: "Institutions" },
  { href: MARKETING.join, label: "Join Ecosystem" },
  { href: MARKETING.contact, label: "Contact" },
];

const pathwayLinks = [
  { href: PATHWAY_ANCHORS.ai, label: "AI Systems" },
  { href: PATHWAY_ANCHORS.data, label: "Data Intelligence" },
  { href: PATHWAY_ANCHORS.creative, label: "Creative AI" },
  { href: PATHWAY_ANCHORS.cloud, label: "Cloud & Cyber" },
  { href: PATHWAY_ANCHORS.engineering, label: "Smart Engineering" },
];

export default function SiteFooter({ className }: Props) {
  return (
    <footer className={`relative border-t border-white/10 ${className ?? ""}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(800px circle at 10% 20%, hsl(var(--ring) / 0.18), transparent 60%)," +
            "radial-gradient(900px circle at 80% 40%, hsl(var(--cyan-500) / 0.14), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/images/brand/symbol-logo.png"
                alt="Sophrion"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <span className="text-sm font-semibold text-foreground">Sophrion</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-foreground/70">
              AI-native career acceleration and innovation ecosystem focused on execution-oriented learning,
              collaborative systems, and future-ready workforce transformation.
            </p>
            <p className="mt-3 text-xs text-foreground/55">
              Built for students, institutions, innovation ecosystems, and the intelligent economy.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Ecosystem</p>
            {ecosystemLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm text-foreground/70 hover:text-[hsl(var(--cyan-500))]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Pathways</p>
            {pathwayLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm text-foreground/70 hover:text-[hsl(var(--cyan-500))]"
              >
                {link.label}
              </Link>
            ))}
            <Link href={MARKETING.blog} className="mt-2 block text-sm text-foreground/70 hover:text-[hsl(var(--cyan-500))]">
              Blog
            </Link>
            <Link href={MARKETING.privacy} className="mt-2 block text-sm text-foreground/70 hover:text-[hsl(var(--cyan-500))]">
              Privacy
            </Link>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Connect</p>
            <a
              href="https://www.linkedin.com/in/sophrion/"
              target="_blank"
              rel="noreferrer"
              className="block text-sm text-foreground/70 hover:text-[hsl(var(--cyan-500))]"
            >
              LinkedIn
            </a>
            <a
              href="https://www.instagram.com/sophrion_private_limited/"
              target="_blank"
              rel="noreferrer"
              className="mt-2 block text-sm text-foreground/70 hover:text-[hsl(var(--cyan-500))]"
            >
              Instagram
            </a>
            <a
              href="https://github.com/sophrion-in"
              target="_blank"
              rel="noreferrer"
              className="mt-2 block text-sm text-foreground/70 hover:text-[hsl(var(--cyan-500))]"
            >
              GitHub
            </a>
            <a
              href="mailto:contact@sophrion.in"
              className="mt-2 block text-sm text-foreground/70 hover:text-[hsl(var(--cyan-500))]"
            >
              Email
            </a>

            <p className="mt-6 text-sm font-semibold text-foreground mb-3">Stay Updated</p>
            <div className="rounded-xl border border-white/10 bg-white/3 p-3 backdrop-blur">
              <NewsletterForm source="footer" />
              <p className="mt-2 text-xs text-foreground/60">
                Product updates and ecosystem news from Sophrion.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-foreground/60 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Sophrion. All rights reserved.</p>
          <p className="text-foreground/50">Building future-ready execution ecosystems.</p>
        </div>
      </div>
    </footer>
  );
}
