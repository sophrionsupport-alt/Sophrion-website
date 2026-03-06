import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import EventRegisterModal from "@/components/forms/EventRegisterModal";

function fmtDateTime(s?: string | null) {
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: event, error } = await supabase
    .from("events")
    .select(
      "id,slug,title,subtitle,description,start_at,end_at,mode,venue,city,state,banner_url,is_published,registration_open"
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !event) {
    return (
      <pre className="p-6 text-sm whitespace-pre-wrap">
        {JSON.stringify({ slug, error, event }, null, 2)}
      </pre>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 text-foreground">
      <h1 className="text-3xl font-semibold">{event.title}</h1>
      {event.subtitle ? <p className="mt-2 text-foreground/70">{event.subtitle}</p> : null}

      <div className="mt-4 text-sm text-foreground/60">
        {fmtDateTime(event.start_at)}
        {event.end_at ? ` → ${fmtDateTime(event.end_at)}` : ""}
        {" • "}
        {[event.city, event.state].filter(Boolean).join(", ")}
      </div>

      {event.description ? (
        <div className="mt-6 rounded-2xl border border-border bg-background/40 p-5 text-sm text-foreground/85 whitespace-pre-wrap">
          {event.description}
        </div>
      ) : null}

      <div className="mt-8">
        {event.registration_open ? (
          <EventRegisterModal slug={event.slug} triggerLabel="Register" />
        ) : (
          <div className="rounded-2xl border border-border bg-background/40 p-4 text-sm text-foreground/70">
            Registrations are currently closed.
          </div>
        )}
      </div>
    </div>
  );
}