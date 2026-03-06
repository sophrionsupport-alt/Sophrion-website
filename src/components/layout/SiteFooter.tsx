import Link from "next/link";
import NewsletterForm from "@/components/forms/NewsletterForm";

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
    <footer className={`relative border-t border-white/10 ${className ?? ""}`}>
      {/* background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(800px circle at 10% 20%, hsl(var(--ring) / 0.18), transparent 60%)," +
            "radial-gradient(900px circle at 80% 40%, hsl(var(--cyan-500) / 0.14), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-12 md:flex-row">

          {/* LEFT — Logo */}
          <div className="md:w-1/3 flex items-start">
          <div className="h-11 md:h-11 flex items-center">
            <img
              src="/images/brand/symbol-logo.png"
              alt="Sophrion"
              className="h-10 w-10 object-contain"
            />
          </div>
        </div>

          {/* RIGHT — Footer Content */}
          <div className="md:w-2/3 grid gap-10 md:grid-cols-3">

            {/* Explore */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">
                Explore
              </p>

              {footerLinks.explore.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-foreground/70 hover:text-[hsl(var(--cyan-500))]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Company */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">
                Company
              </p>

              {footerLinks.company.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-foreground/70 hover:text-[hsl(var(--cyan-500))]"
                >
                  {link.label}
                </Link>
              ))}

              {/* Socials below links */}
              <div className="flex items-center gap-3 mt-4 text-sm text-foreground/60">
                <a
                  href="https://www.linkedin.com/in/sophrion/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[hsl(var(--cyan-500))]"
                >
                  LinkedIn
                </a>

                <span className="text-foreground/30">•</span>

                <a
                  href="https://x.com/sophrion"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[hsl(var(--cyan-500))]"
                >
                  X
                </a>

                <span className="text-foreground/30">•</span>

                <a
                  href="https://www.instagram.com/sophrion_private_limited/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[hsl(var(--cyan-500))]"
                >
                  Instagram
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">
                Stay Updated
              </p>

              <p className="text-sm text-foreground/70 mb-4">
                Get event announcements and Sophrion updates.
              </p>

              <div className="rounded-2xl border border-white/10 bg-white/3 p-4 backdrop-blur">
                <NewsletterForm source="footer" />

                <p className="mt-3 text-xs text-foreground/60">
                  Or email{" "}
                  <a
                    href="mailto:contact@sophrion.in"
                    className="underline underline-offset-4 hover:text-[hsl(var(--cyan-500))]"
                  >
                    contact@sophrion.in
                  </a>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-foreground/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Sophrion. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[hsl(var(--cyan-500))]">
              Privacy
            </Link>

            <Link href="/contact" className="hover:text-[hsl(var(--cyan-500))]">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}