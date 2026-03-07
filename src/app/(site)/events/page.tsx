import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function fmtDate(s?: string | null) {
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
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
      <div className="mx-auto max-w-6xl px-4 py-12 text-foreground">
        <h1 className="text-2xl font-semibold">Events</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Failed to load events. Check Supabase connection and RLS policies.
        </p>
        <pre className="mt-4 overflow-auto rounded-2xl border border-border bg-background/40 p-4 text-xs text-foreground/70">
          {error.message}
        </pre>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 text-foreground">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Events</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Browse upcoming workshops, hackathons, and innovation experiences.
        </p>
      </div>

      {!events?.length ? (
        <div className="rounded-2xl border border-border bg-background/40 p-6 text-sm text-foreground/70">
          No events published yet.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => {
            const location = buildLocation(e.city, e.state);
            const modeVenue = buildModeVenue(e.mode, e.venue);

            return (
              <Link
                key={e.id}
                href={`/events/${e.slug}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-card transition hover:border-white/20 hover:bg-card/80"
              >
                <div className="relative aspect-video overflow-hidden border-b border-white/10 bg-background/40">
                  {e.banner_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={e.banner_url}
                      alt={e.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.22),transparent_55%)] text-sm text-foreground/40">
                      No banner
                    </div>
                  )}

                  <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                      {labelEventType(e.event_type)}
                    </span>
                    <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                      {labelRegistrationType(e.registration_type)}
                    </span>
                  </div>

                  <div className="absolute right-3 top-3">
                    <span
                      className={[
                        "rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur",
                        e.registration_open
                          ? "border border-emerald-400/20 bg-emerald-500/15 text-emerald-200"
                          : "border border-rose-400/20 bg-rose-500/15 text-rose-200",
                      ].join(" ")}
                    >
                      {e.registration_open ? "Registration Open" : "Closed"}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="text-base font-semibold">{e.title}</div>

                  {e.subtitle ? (
                    <div className="mt-1 text-sm text-foreground/70">
                      {e.subtitle}
                    </div>
                  ) : null}

                  {e.overview ? (
                    <p className="mt-3 line-clamp-3 text-sm text-foreground/65">
                      {e.overview}
                    </p>
                  ) : null}

                  <div className="mt-4 space-y-1">
                    <div className="text-xs text-foreground/60">
                      {fmtDate(e.start_at) || "Date to be announced"}
                    </div>

                    {location ? (
                      <div className="text-xs text-foreground/55">{location}</div>
                    ) : null}

                    {modeVenue ? (
                      <div className="text-xs text-foreground/50">{modeVenue}</div>
                    ) : null}
                  </div>

                  <div className="mt-4 text-sm font-medium text-[hsl(var(--cyan-500))]">
                    View event →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}