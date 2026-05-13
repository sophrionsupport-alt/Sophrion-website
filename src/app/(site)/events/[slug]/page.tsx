import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Trophy,
  FileText,
  IndianRupee,
  Gift,
  Users,
} from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import EventRegistrationSection from "@/components/forms/EventRegistrationSection";
import { ReactNode } from "react";

type EventRecord = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  overview: string | null;

  start_at: string | null;
  end_at: string | null;
  mode: string | null;
  venue: string | null;
  city: string | null;
  state: string | null;
  banner_url: string | null;

  event_type: string | null;
  registration_type: string | null;

  min_team_size: number | null;
  max_team_size: number | null;
  requires_female_member: boolean | null;
  required_female_count: number | null;
  role_based_team: boolean | null;

  rules_markdown: string | null;
  schedule_json: unknown | null;
  problem_statements_json: unknown | null;
  judging_json: unknown | null;

  fee?: string | null;
  prize_pool?: string | null;
  winner_prize?: string | null;
  runner_prize?: string | null;
  benefits_json?: unknown | null;
  sample_roles_json?: unknown | null;

  registration_open: boolean;
};

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

function PrettyText({ text }: { text?: string | null }) {
  if (!text) return null;

  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4 text-sm leading-7 text-foreground/80">
      {paragraphs.map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </div>
  );
}

function RulesList({ text }: { text?: string | null }) {
  if (!text) return null;

  const items = text
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!items.length) return null;

  return (
    <ul className="space-y-3 text-sm leading-7 text-foreground/80">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/60" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-background/40 p-6">
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
      <div className="text-xs text-foreground/60">{label}</div>
      <div className="mt-1">{value}</div>
    </div>
  );
}

function Schedule({ schedule }: { schedule: unknown }) {
  if (!Array.isArray(schedule) || schedule.length === 0) return null;

  const grouped: Record<string, Record<string, unknown>[]> = {};

  schedule.forEach((item) => {
    if (!item || typeof item !== "object") return;
    const row = item as Record<string, unknown>;
    const day = String(row.day ?? "Schedule");
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(row);
  });

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([day, items]) => (
        <div key={day}>
          <h3 className="mb-3 text-sm font-semibold text-foreground/70">
            {day}
          </h3>

          <div className="space-y-3">
            {items.map((s, i) => (
              <div
                key={i}
                className="grid grid-cols-[90px_1fr] gap-4 border-b border-white/10 pb-3"
              >
                <div className="text-sm text-foreground/60">
                  {String(s.time ?? "")}
                </div>
                <div className="text-sm text-foreground">
                  {String(s.title ?? "")}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Problems({ items }: { items: unknown }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <div className="space-y-3">
      {items.map((p, i) => {
        const row =
          p && typeof p === "object" ? (p as Record<string, unknown>) : {};
        const title = String(row.title ?? "");
        const summary = String(row.summary ?? row.description ?? "");

        return (
          <details
            key={i}
            className="group rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <summary className="cursor-pointer text-sm font-medium">
              {title || `Problem ${i + 1}`}
            </summary>

            {summary ? (
              <p className="mt-3 text-sm text-foreground/70">{summary}</p>
            ) : null}
          </details>
        );
      })}
    </div>
  );
}

function Judging({ items }: { items: unknown }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((j, i) => {
        const row =
          j && typeof j === "object" ? (j as Record<string, unknown>) : {};
        const criterion = String(row.criterion ?? row.criteria ?? "");
        const weight = String(row.weight ?? "");

        return (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm"
          >
            <div className="font-medium">{criterion || `Criteria ${i + 1}`}</div>
            {weight ? (
              <div className="mt-1 text-xs text-foreground/60">{weight}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function PrizeSection({
  prizePool,
  winnerPrize,
  runnerPrize,
}: {
  prizePool?: string | null;
  winnerPrize?: string | null;
  runnerPrize?: string | null;
}) {
  if (!prizePool && !winnerPrize && !runnerPrize) return null;

  return (
    <Section title="Prizes" icon={<Trophy size={16} />}>
      <div className="grid gap-4 sm:grid-cols-3">
        {prizePool ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-foreground/60">Prize Pool</div>
            <div className="mt-1 text-base font-semibold">{prizePool}</div>
          </div>
        ) : null}

        {winnerPrize ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-foreground/60">Winner Prize</div>
            <div className="mt-1 text-base font-semibold">{winnerPrize}</div>
          </div>
        ) : null}

        {runnerPrize ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-foreground/60">Runner Prize</div>
            <div className="mt-1 text-base font-semibold">{runnerPrize}</div>
          </div>
        ) : null}
      </div>
    </Section>
  );
}

function Benefits({ items }: { items: unknown }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  const clean = items.map((x) => String(x ?? "").trim()).filter(Boolean);
  if (!clean.length) return null;

  return (
    <Section title="Benefits" icon={<Gift size={16} />}>
      <div className="grid gap-3 sm:grid-cols-2">
        {clean.map((item, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-foreground/80"
          >
            {item}
          </div>
        ))}
      </div>
    </Section>
  );
}

function TeamRoles({ items }: { items: unknown }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  const clean = items.map((x) => String(x ?? "").trim()).filter(Boolean);
  if (!clean.length) return null;

  return (
    <Section title="Suggested Team Roles" icon={<Users size={16} />}>
      <div className="grid gap-3 sm:grid-cols-2">
        {clean.map((item, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-foreground/80"
          >
            {item}
          </div>
        ))}
      </div>
    </Section>
  );
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  const fullSelect = `
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
    judging_json,
    fee,
    prize_pool,
    winner_prize,
    runner_prize,
    benefits_json,
    sample_roles_json,
    registration_open
  `;

  const fallbackSelect = `
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
    judging_json,
    registration_open
  `;

  let event: EventRecord | null = null;

  const fullQuery = await supabase
    .from("events")
    .select(fullSelect)
    .eq("slug", slug)
    .maybeSingle();

  if (fullQuery.error) {
    const fallbackQuery = await supabase
      .from("events")
      .select(fallbackSelect)
      .eq("slug", slug)
      .maybeSingle();

    if (fallbackQuery.error) {
      console.error("Event page query error:", fallbackQuery.error);
      notFound();
    }

    event = fallbackQuery.data as EventRecord | null;
  } else {
    event = fullQuery.data as EventRecord | null;
  }

  if (!event) {
    notFound();
  }

  const location = [event.venue, event.city, event.state]
    .filter(Boolean)
    .join(", ");

  const supportsTeam =
    event.registration_type === "team" || event.registration_type === "both";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Link>

      <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-background/40">
        {event.banner_url ? (
          <div className="relative aspect-16/6">
            <Image
              src={event.banner_url}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              unoptimized
            />
          </div>
        ) : null}

        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            <span className="badge">{labelEventType(event.event_type)}</span>
            <span className="badge">
              {labelRegistrationType(event.registration_type)}
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-semibold">{event.title}</h1>

          {event.subtitle ? (
            <p className="mt-2 text-foreground/70">{event.subtitle}</p>
          ) : null}

          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            <Info label="Start" value={fmtDateTime(event.start_at)} />
            <Info label="End" value={fmtDateTime(event.end_at)} />
            <Info label="Mode" value={event.mode || "TBA"} />
            <Info label="Location" value={location || "TBA"} />
          </div>

          {event.fee || event.prize_pool ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {event.fee ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-xs text-foreground/60">
                    <IndianRupee className="h-4 w-4" />
                    Registration Fee
                  </div>
                  <div className="mt-1 text-lg font-semibold">{event.fee}</div>
                </div>
              ) : null}

              {event.prize_pool ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-xs text-foreground/60">
                    <Trophy className="h-4 w-4" />
                    Prize Pool
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    {event.prize_pool}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {event.overview ? (
            <Section title="Overview" icon={<FileText size={16} />}>
              <PrettyText text={event.overview} />
            </Section>
          ) : null}

          {Array.isArray(event.schedule_json) && event.schedule_json.length > 0 ? (
            <Section title="Schedule" icon={<CalendarDays size={16} />}>
              <Schedule schedule={event.schedule_json} />
            </Section>
          ) : null}

          {Array.isArray(event.problem_statements_json) &&
          event.problem_statements_json.length > 0 ? (
            <Section title="Problem Statements">
              <Problems items={event.problem_statements_json} />
            </Section>
          ) : null}

          {Array.isArray(event.judging_json) && event.judging_json.length > 0 ? (
            <Section title="Judging Criteria" icon={<Trophy size={16} />}>
              <Judging items={event.judging_json} />
            </Section>
          ) : null}

          <PrizeSection
            prizePool={event.prize_pool}
            winnerPrize={event.winner_prize}
            runnerPrize={event.runner_prize}
          />

          <Benefits items={event.benefits_json} />

          <TeamRoles items={event.sample_roles_json} />

          {event.rules_markdown ? (
            <Section title="Rules">
              <RulesList text={event.rules_markdown} />
            </Section>
          ) : null}
        </div>

        <aside className="sticky top-24 h-fit">
          <div className="rounded-3xl border border-white/10 bg-background/40 p-6">
            <h3 className="mb-3 text-lg font-semibold">Register</h3>

            <EventRegistrationSection
              event={{
                slug: event.slug,
                registration_open: event.registration_open,
                registration_type: event.registration_type as
                  | "individual"
                  | "team"
                  | "both",
                min_team_size: event.min_team_size,
                max_team_size: event.max_team_size,
                requires_female_member: event.requires_female_member,
                required_female_count: event.required_female_count,
                role_based_team: event.role_based_team,
              }}
            />

            {(event.fee || supportsTeam) && (
              <div className="mt-6 space-y-3 text-sm">
                {event.fee ? (
                  <div>
                    <strong>Fee</strong>
                    <div className="text-foreground/70">{event.fee}</div>
                  </div>
                ) : null}

                {supportsTeam ? (
                  <div>
                    <strong>Team Size</strong>
                    <div className="text-foreground/70">
                      {event.min_team_size} - {event.max_team_size}
                    </div>
                  </div>
                ) : null}

                {event.requires_female_member ? (
                  <div>
                    <strong>Female Members</strong>
                    <div className="text-foreground/70">
                      Minimum {event.required_female_count}
                    </div>
                  </div>
                ) : null}

                {event.role_based_team ? (
                  <div className="text-foreground/70">
                    Teams must have defined roles.
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}