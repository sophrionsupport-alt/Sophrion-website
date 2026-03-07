import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import EventRegistrationSection from "@/components/forms/EventRegistrationSection";

function fmtDateTime(s?: string | null) {
  if (!s) return "To be announced";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "To be announced";
  return d.toLocaleString();
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

function renderStructuredBlock(value: unknown) {
  if (!value) return null;

  if (Array.isArray(value)) {
    return (
      <div className="space-y-3">
        {value.map((item, index) => {
          if (typeof item === "string") {
            return (
              <div
                key={index}
                className="rounded-xl border border-white/10 bg-background/30 p-4 text-sm text-foreground/85"
              >
                {item}
              </div>
            );
          }

          if (item && typeof item === "object") {
            const entries = Object.entries(item as Record<string, unknown>);
            return (
              <div
                key={index}
                className="rounded-xl border border-white/10 bg-background/30 p-4"
              >
                <div className="space-y-2 text-sm text-foreground/85">
                  {entries.map(([key, val]) => (
                    <div key={key}>
                      <span className="font-medium capitalize text-foreground">
                        {key.replace(/_/g, " ")}:
                      </span>{" "}
                      <span className="text-foreground/80">
                        {typeof val === "string"
                          ? val
                          : JSON.stringify(val, null, 2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <div
              key={index}
              className="rounded-xl border border-white/10 bg-background/30 p-4 text-sm text-foreground/85"
            >
              {String(item)}
            </div>
          );
        })}
      </div>
    );
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    return (
      <div className="rounded-xl border border-white/10 bg-background/30 p-4">
        <div className="space-y-2 text-sm text-foreground/85">
          {entries.map(([key, val]) => (
            <div key={key}>
              <span className="font-medium capitalize text-foreground">
                {key.replace(/_/g, " ")}:
              </span>{" "}
              <span className="text-foreground/80">
                {typeof val === "string" ? val : JSON.stringify(val, null, 2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-background/30 p-4 text-sm text-foreground/85">
      {String(value)}
    </div>
  );
}

function InfoChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-foreground/75">
      {children}
    </span>
  );
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
      `
      id,
      slug,
      title,
      subtitle,
      description,
      overview,
      start_at,
      end_at,
      mode,
      venue,
      city,
      state,
      banner_url,
      is_published,
      registration_open,
      event_type,
      registration_type,
      min_team_size,
      max_team_size,
      requires_female_member,
      required_female_count,
      role_based_team,
      rules_markdown,
      schedule_json,
      problem_statements_json,
      judging_json
    `
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !event) {
    notFound();
  }

  const isWorkshop = event.event_type === "workshop";
  const isHackathon = event.event_type === "hackathon";
  const isHybrid = event.event_type === "hybrid";

  const supportsTeamRegistration =
    event.registration_type === "team" || event.registration_type === "both";

  const location = [event.venue, event.city, event.state]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 text-foreground">
      <Link
        href="/events"
        className="mb-6 inline-flex items-center gap-2 text-sm text-foreground/70 transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Link>

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-background/40">
        {event.banner_url ? (
          <div className="relative aspect-16/7 w-full overflow-hidden border-b border-white/10 bg-background/40">
            <img
              src={event.banner_url}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <InfoChip>{labelEventType(event.event_type)}</InfoChip>
            <InfoChip>{labelRegistrationType(event.registration_type)}</InfoChip>
            <InfoChip>
              {event.registration_open ? "Registration Open" : "Registration Closed"}
            </InfoChip>
          </div>

          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">{event.title}</h1>

          {event.subtitle ? (
            <p className="mt-3 text-base text-foreground/70">{event.subtitle}</p>
          ) : null}

          <div className="mt-6 grid gap-3 text-sm text-foreground/65 sm:grid-cols-2">
            <div>
              <span className="font-medium text-foreground/85">Starts:</span>{" "}
              {fmtDateTime(event.start_at)}
            </div>
            <div>
              <span className="font-medium text-foreground/85">Ends:</span>{" "}
              {fmtDateTime(event.end_at)}
            </div>
            <div>
              <span className="font-medium text-foreground/85">Mode:</span>{" "}
              {event.mode || "To be announced"}
            </div>
            <div>
              <span className="font-medium text-foreground/85">Location:</span>{" "}
              {location || "To be announced"}
            </div>
          </div>

          <div className="mt-8">
            <EventRegistrationSection
              event={{
                slug: event.slug,
                registration_open: event.registration_open,
                registration_type: event.registration_type,
                min_team_size: event.min_team_size,
                max_team_size: event.max_team_size,
                requires_female_member: event.requires_female_member,
                required_female_count: event.required_female_count,
                role_based_team: event.role_based_team,
              }}
            />
          </div>
        </div>
      </section>

      {event.overview ? (
        <section className="mt-8 rounded-3xl border border-white/10 bg-background/40 p-6">
          <h2 className="text-xl font-semibold">Overview</h2>
          <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-foreground/85">
            {event.overview}
          </div>
        </section>
      ) : event.description ? (
        <section className="mt-8 rounded-3xl border border-white/10 bg-background/40 p-6">
          <h2 className="text-xl font-semibold">About this event</h2>
          <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-foreground/85">
            {event.description}
          </div>
        </section>
      ) : null}

      {supportsTeamRegistration ? (
        <section className="mt-8 rounded-3xl border border-white/10 bg-background/40 p-6">
          <h2 className="text-xl font-semibold">Team requirements</h2>

          <div className="mt-4 grid gap-3 text-sm text-foreground/85 sm:grid-cols-2">
            <div>
              <span className="font-medium text-foreground">Team size:</span>{" "}
              {event.min_team_size === event.max_team_size
                ? `Exactly ${event.min_team_size}`
                : `${event.min_team_size ?? "—"} to ${event.max_team_size ?? "—"}`}
            </div>

            <div>
              <span className="font-medium text-foreground">
                Female member requirement:
              </span>{" "}
              {event.requires_female_member
                ? `At least ${event.required_female_count ?? 1}`
                : "No"}
            </div>

            <div>
              <span className="font-medium text-foreground">
                Role-based participation:
              </span>{" "}
              {event.role_based_team ? "Yes" : "No"}
            </div>
          </div>
        </section>
      ) : null}

      {(isWorkshop || isHybrid) && event.schedule_json ? (
        <section className="mt-8 rounded-3xl border border-white/10 bg-background/40 p-6">
          <h2 className="text-xl font-semibold">
            {isHybrid ? "Workshop schedule" : "Schedule"}
          </h2>
          <div className="mt-4">{renderStructuredBlock(event.schedule_json)}</div>
        </section>
      ) : null}

      {(isHackathon || isHybrid) && event.problem_statements_json ? (
        <section className="mt-8 rounded-3xl border border-white/10 bg-background/40 p-6">
          <h2 className="text-xl font-semibold">Problem statements</h2>
          <div className="mt-4">
            {renderStructuredBlock(event.problem_statements_json)}
          </div>
        </section>
      ) : null}

      {(isHackathon || isHybrid) && event.judging_json ? (
        <section className="mt-8 rounded-3xl border border-white/10 bg-background/40 p-6">
          <h2 className="text-xl font-semibold">Judging criteria</h2>
          <div className="mt-4">{renderStructuredBlock(event.judging_json)}</div>
        </section>
      ) : null}

      {event.rules_markdown ? (
        <section className="mt-8 rounded-3xl border border-white/10 bg-background/40 p-6">
          <h2 className="text-xl font-semibold">
            {isHybrid ? "Participation rules" : "Rules"}
          </h2>
          <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-foreground/85">
            {event.rules_markdown}
          </div>
        </section>
      ) : null}
    </div>
  );
}