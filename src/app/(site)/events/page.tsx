import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function fmtDate(s?: string | null) {
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default async function EventsPage() {
  const supabase = await createSupabaseServerClient();

  const { data: events, error } = await supabase
    .from("events")
    .select("id,slug,title,subtitle,start_at,city,state,mode,venue,banner_url")
    .eq("is_published", true)
    .order("start_at", { ascending: true });

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-foreground">
        <h1 className="text-2xl font-semibold">Events</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Failed to load events. Check Supabase connection and RLS policies.
        </p>
        <pre className="mt-4 rounded-2xl border border-border bg-background/40 p-4 text-xs text-foreground/70 overflow-auto">
          {error.message}
        </pre>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 text-foreground">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Events</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Browse upcoming campus events.
        </p>
      </div>

      {!events?.length ? (
        <div className="rounded-2xl border border-border bg-background/40 p-6 text-sm text-foreground/70">
          No events published yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <Link
              key={e.id}
              href={`/events/${e.slug}`}
              className="rounded-2xl border border-border bg-card p-5 hover:bg-card/80 transition"
            >
              <div className="text-base font-semibold">{e.title}</div>
              {e.subtitle ? (
                <div className="mt-1 text-sm text-foreground/70">{e.subtitle}</div>
              ) : null}

              <div className="mt-3 text-xs text-foreground/60">
                {fmtDate(e.start_at)} • {[e.city, e.state].filter(Boolean).join(", ")}
              </div>

              <div className="mt-1 text-xs text-foreground/50">
                {e.mode ?? ""}{e.venue ? ` • ${e.venue}` : ""}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}