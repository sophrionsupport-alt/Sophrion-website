import Link from "next/link";
import { CalendarDays, MapPin, Layers3, ArrowRight } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function fmtDate(s?: string | null) {
  if (!s) return "Date to be announced";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "Date to be announced";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function labelEventType(value?: string | null) {
  switch (value) {
    case "workshop":
      return "Workshop";
    case "hackathon":
      return "Hackathon";
    case "hybrid":
      return "Hybrid";
    default:
      return "Event";
  }
}

function labelRegistrationType(value?: string | null) {
  switch (value) {
    case "individual":
      return "Individual";
    case "team":
      return "Team";
    case "both":
      return "Individual + Team";
    default:
      return "Registration";
  }
}

function buildLocation(city?: string | null, state?: string | null) {
  return [city, state].filter(Boolean).join(", ");
}

function buildModeVenue(mode?: string | null, venue?: string | null) {
  if (mode && venue) return `${mode} • ${venue}`;
  if (mode) return mode;
  if (venue) return venue;
  return "";
}

function getSummary(
  overview?: string | null,
  subtitle?: string | null
) {
  return overview || subtitle || "";
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] font-medium text-white/85 backdrop-blur">
      {children}
    </span>
  );
}

export default async function EventsPage() {
  const supabase = await createSupabaseServerClient();

  const { data: events, error } = await supabase
    .from("events")
    .select(
      `
      id,
      slug,
      title,
      subtitle,
      overview,
      description,
      start_at,
      city,
      state,
      mode,
      venue,
      banner_url,
      event_type,
      registration_type,
      registration_open
      `
    )
    .eq("is_published", true)
    .order("start_at", { ascending: true });

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-foreground sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-background/40 p-6 sm:p-8">
          <h1 className="text-2xl font-semibold">Events</h1>
          <p className="mt-2 text-sm text-foreground/60">
            Failed to load events. Check Supabase connection and RLS policies.
          </p>
          <pre className="mt-4 overflow-auto rounded-2xl border border-white/10 bg-black/20 p-4 text-xs text-foreground/70">
            {error.message}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 text-foreground sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-background/40 px-6 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(700px circle at 0% 0%, rgba(124,58,237,0.16), transparent 45%), radial-gradient(700px circle at 100% 0%, rgba(6,182,212,0.14), transparent 40%)",
          }}
        />
        <div className="relative max-w-3xl">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/60">
            Events
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Workshops, hackathons, and high-impact student experiences
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/68 sm:text-base">
            Explore upcoming Sophrion events designed for learning, collaboration,
            innovation, and practical problem-solving.
          </p>
        </div>
      </section>

      <section className="mt-8">
        {!events?.length ? (
          <div className="rounded-3xl border border-white/10 bg-background/40 p-6 text-sm text-foreground/70 sm:p-8">
            No events published yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((e) => {
              const location = buildLocation(e.city, e.state);
              const modeVenue = buildModeVenue(e.mode, e.venue);
              const summary = getSummary(e.overview, e.description || e.subtitle);

              return (
                <Link
                  key={e.id}
                  href={`/events/${e.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-card/90 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-card"
                >
                  <div className="relative aspect-16/10 overflow-hidden border-b border-white/10 bg-background/40">
                    {e.banner_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={e.banner_url}
                        alt={e.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.22),transparent_55%)] text-sm text-foreground/40">
                        No banner
                      </div>
                    )}

                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/15 to-transparent" />

                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      <Chip>{labelEventType(e.event_type)}</Chip>
                      <Chip>{labelRegistrationType(e.registration_type)}</Chip>
                    </div>

                    <div className="absolute right-3 top-3">
                      <span
                        className={[
                          "rounded-full px-3 py-1 text-[11px] font-medium backdrop-blur",
                          e.registration_open
                            ? "border border-emerald-400/20 bg-emerald-500/15 text-emerald-200"
                            : "border border-rose-400/20 bg-rose-500/15 text-rose-200",
                        ].join(" ")}
                      >
                        {e.registration_open ? "Registration Open" : "Closed"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div>
                      <h2 className="text-lg font-semibold leading-tight text-foreground sm:text-xl">
                        {e.title}
                      </h2>

                      {e.subtitle ? (
                        <p className="mt-2 text-sm leading-6 text-foreground/70">
                          {e.subtitle}
                        </p>
                      ) : null}

                      {summary ? (
                        <p className="mt-3 line-clamp-3 text-sm leading-7 text-foreground/62">
                          {summary}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-5 space-y-3 border-t border-white/10 pt-4 text-sm text-foreground/68">
                      <div className="flex items-start gap-2.5">
                        <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-foreground/45" />
                        <span>{fmtDate(e.start_at)}</span>
                      </div>

                      {location ? (
                        <div className="flex items-start gap-2.5">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-foreground/45" />
                          <span>{location}</span>
                        </div>
                      ) : null}

                      {modeVenue ? (
                        <div className="flex items-start gap-2.5">
                          <Layers3 className="mt-0.5 h-4 w-4 shrink-0 text-foreground/45" />
                          <span>{modeVenue}</span>
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[hsl(var(--cyan-500))]">
                      <span>View event</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}