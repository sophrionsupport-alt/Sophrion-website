import Link from "next/link";
import NewsletterForm from "@/components/forms/NewsletterForm";

type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | Record<string, boolean>
  | ClassValue[];

function cn(...values: ClassValue[]) {
  const out: string[] = [];
  const walk = (v: ClassValue) => {
    if (!v) return;
    if (typeof v === "string" || typeof v === "number") return out.push(String(v));
    if (Array.isArray(v)) return v.forEach(walk);
    if (typeof v === "object") {
      for (const [k, ok] of Object.entries(v)) if (ok) out.push(k);
    }
  };
  values.forEach(walk);
  return out.join(" ");
}

type Props = {
  className?: string;
};

const footerLinks = {
  explore: [
    { href: "/students", label: "Students" },
    { href: "/colleges", label: "Colleges" },
    { href: "/events", label: "Events" },
    { href: "/blog", label: "Blog" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/careers", label: "Careers" }, 
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy" },
  ],
};

export default function SiteFooter({ className }: Props) {
  return (
    <footer
      className={cn(
        "relative border-t border-white/10",
        "overflow-hidden",
        className
      )}
    >
      {/* Ambient gradient layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(900px circle at 15% 20%, hsl(var(--ring) / 0.18), transparent 55%)," +
            "radial-gradient(900px circle at 80% 40%, hsl(var(--cyan-500) / 0.14), transparent 60%)," +
            "linear-gradient(to bottom, rgba(255,255,255,0.02), rgba(255,255,255,0.00))",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        {/* Brand */}
        <div className="grid gap-4">
          <Link href="/" className="inline-flex items-center gap-3">
            <div
              className={cn(
                "grid h-10 w-10 place-items-center rounded-2xl text-white font-bold",
                "bg-linear-to-br from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))]",
                "shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_18px_55px_rgba(124,58,237,0.18)]"
              )}
              aria-hidden="true"
            >
              S
            </div>

            <div className="leading-tight">
              <div className="text-sm font-semibold text-foreground">Sophrion</div>
              <div className="text-xs text-foreground/60">
                Campus–Industry Bridge Infrastructure
              </div>
            </div>
          </Link>

          <p className="text-sm text-foreground/70">
            A simple, scalable system to help institutions measure readiness and improve outcomes.
          </p>

          {/* Optional social links (safe placeholders) */}
          <div className="flex items-center gap-3 pt-1">
            <a
              className="text-xs text-foreground/60 hover:text-[hsl(var(--cyan-500))] transition"
              href="#"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
            <span className="text-foreground/20">•</span>
            <a
              className="text-xs text-foreground/60 hover:text-[hsl(var(--cyan-500))] transition"
              href="#"
              aria-label="Twitter"
            >
              X
            </a>
            <span className="text-foreground/20">•</span>
            <a
              className="text-xs text-foreground/60 hover:text-[hsl(var(--cyan-500))] transition"
              href="#"
              aria-label="Instagram"
            >
              Instagram
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-8">
          <div className="grid gap-2">
            <div className="text-sm font-semibold text-foreground">Explore</div>
            {footerLinks.explore.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "text-sm text-foreground/70 transition",
                  "hover:text-[hsl(var(--cyan-500))]"
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="grid gap-2">
            <div className="text-sm font-semibold text-foreground">Company</div>
            {footerLinks.company.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "text-sm text-foreground/70 transition",
                  "hover:text-[hsl(var(--cyan-500))]"
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="grid gap-3">
          <div className="text-sm font-semibold text-foreground">Stay Updated</div>
          <p className="text-sm text-foreground/70">
            Get event announcements and Sophrion updates.
          </p>

          <div
            className={cn(
              "rounded-3xl border border-white/10 p-4",
              "bg-white/3 backdrop-blur",
              "shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
            )}
          >
            <NewsletterForm source="footer" />
            <p className="mt-3 text-xs text-foreground/60">
              Or email{" "}
              <a
                className="hover:text-[hsl(var(--cyan-500))] underline underline-offset-4 transition"
                href="mailto:contact@sophrion.in"
              >
                contact@sophrion.in
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-foreground/60">
            © {new Date().getFullYear()} Sophrion. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link className="text-xs text-foreground/60 hover:text-[hsl(var(--cyan-500))] transition" href="/privacy">
              Privacy
            </Link>
            <Link className="text-xs text-foreground/60 hover:text-[hsl(var(--cyan-500))] transition" href="/contact">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}