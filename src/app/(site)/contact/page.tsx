import {
  Mail as MailIcon,
  Phone,
  MapPin,
  Linkedin,
  Instagram,
  Twitter,
} from "lucide-react";
import ContactForm from "@/components/forms/ContactForm";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Page() {
  const socialLinks = [
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "X (Twitter)", icon: Twitter, href: "#" },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Cosmic atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className={cn(
            "absolute inset-0",
            "[background:",
            "radial-gradient(1200px_circle_at_18%_12%,hsl(var(--ring)/0.22),transparent_45%),",
            "radial-gradient(1000px_circle_at_82%_36%,hsl(var(--cyan-500)/0.14),transparent_45%)",
            "]"
          )}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--background)))]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: content */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3 py-1 text-xs text-foreground/70 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--cyan-500))]" />
              Sophrion Support • Partnerships • Programs
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Get in touch
            </h1>
            <p className="mt-4 text-base leading-relaxed text-foreground/70 sm:text-lg">
              Share what you’re trying to achieve — student programs, college
              partnerships, or general questions. We’ll respond with next steps.
            </p>

            {/* Info cards */}
            <div className="mt-10 space-y-4">
              <InfoRow
                icon={MailIcon}
                title="Email"
                value="contact@sophrion.in"
              />
              <InfoRow
                icon={Phone}
                title="Phone"
                value="Add your support number"
              />
              <InfoRow
                icon={MapPin}
                title="Location"
                value="Hyderabad, India"
              />
            </div>

            {/* Social */}
            <div className="mt-10 flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className={cn(
                    "group inline-flex h-11 w-11 items-center justify-center rounded-full",
                    "border border-white/10 bg-white/3 backdrop-blur",
                    "text-foreground/80 transition",
                    "hover:bg-white/6 hover:text-foreground",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]"
                  )}
                >
                  <s.icon className="h-5 w-5 transition group-hover:scale-[1.02]" />
                </a>
              ))}
            </div>

            {/* Small note */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/3 p-4 text-sm text-foreground/70 backdrop-blur">
              Prefer fast routing? Mention <span className="text-foreground">“College Partnership”</span> or{" "}
              <span className="text-foreground">“Student Program”</span> in your message.
            </div>
          </div>

          {/* Right: form container (glass card) */}
          <div className="rounded-3xl border border-white/10 bg-white/3 p-5 backdrop-blur sm:p-7">
            <div className="mb-5">
              <div className="text-sm font-medium text-foreground">
                Send a message
              </div>
              <div className="mt-1 text-sm text-foreground/60">
                We typically respond within 1–2 business days.
              </div>
            </div>

            {/* Your existing component */}
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/3 p-4 backdrop-blur">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/4">
        <Icon className="h-5 w-5 text-foreground/80" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-foreground">{title}</div>
        <div className="mt-0.5 truncate text-sm text-foreground/70">{value}</div>
      </div>
      <div className="ml-auto hidden sm:block">
        <div className="h-10 w-18 rounded-xl bg-[linear-gradient(to_right,hsl(var(--brand-600)),hsl(var(--cyan-500)))] opacity-[0.18]" />
      </div>
    </div>
  );
}