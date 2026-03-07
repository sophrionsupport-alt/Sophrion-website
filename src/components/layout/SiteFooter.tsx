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

      {/* Background Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(800px circle at 10% 20%, hsl(var(--ring) / 0.18), transparent 60%)," +
            "radial-gradient(900px circle at 80% 40%, hsl(var(--cyan-500) / 0.14), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-10">

        {/* 10% Logo / 90% Content */}
        <div className="grid grid-cols-[10%_90%] gap-8 items-start">

          {/* Logo */}
          <div className="flex items-start">
            <img
              src="/images/brand/symbol-logo.png"
              alt="Sophrion"
              className="h-10 w-10 object-contain"
            />
          </div>

          {/* Footer Content */}
          <div className="grid gap-8 md:grid-cols-4">

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

              {/* Social Links */}
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

            {/* Newsletter (wide) */}
            <div className="md:col-span-2">
              <p className="text-sm font-semibold text-foreground mb-3">
                Stay Updated
              </p>

              <p className="text-sm text-foreground/70 mb-3">
                Get event announcements and Sophrion updates.
              </p>

              <div className="rounded-xl border border-white/10 bg-white/3 p-3 backdrop-blur">
                <NewsletterForm source="footer" />

                <p className="mt-2 text-xs text-foreground/60">
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

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-foreground/60 md:flex-row md:items-center md:justify-between">

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