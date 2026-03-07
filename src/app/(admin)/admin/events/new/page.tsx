"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

type EventType = "workshop" | "hackathon" | "hybrid";
type RegistrationType = "individual" | "team";

type EventFormState = {
  title: string;
  subtitle: string;
  slug: string;

  description: string;
  overview: string;

  mode: string;
  city: string;
  state: string;
  venue: string;

  start_at: string;
  end_at: string;
  banner_url: string;

  is_published: boolean;
  registration_open: boolean;

  event_type: EventType;
  registration_type: RegistrationType;

  min_team_size: string;
  max_team_size: string;
  requires_female_member: boolean;
  required_female_count: string;
  role_based_team: boolean;

  rules_markdown: string;
  schedule_json: string;
  problem_statements_json: string;
  judging_json: string;
};

function inputClassName() {
  return "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-foreground/40 focus:border-foreground/30";
}

function textareaClassName() {
  return "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-foreground/40 focus:border-foreground/30";
}

function sectionClassName() {
  return "rounded-2xl border border-white/10 bg-background/40 p-5";
}

export default function NewEventPage() {
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);

  const [form, setForm] = React.useState<EventFormState>({
    title: "",
    subtitle: "",
    slug: "",

    description: "",
    overview: "",

    mode: "offline",
    city: "",
    state: "",
    venue: "",

    start_at: "",
    end_at: "",
    banner_url: "",

    is_published: false,
    registration_open: true,

    event_type: "workshop",
    registration_type: "individual",

    min_team_size: "",
    max_team_size: "",
    requires_female_member: false,
    required_female_count: "",
    role_based_team: false,

    rules_markdown: "",
    schedule_json: "",
    problem_statements_json: "",
    judging_json: "",
  });

  function update<K extends keyof EventFormState>(
    key: K,
    value: EventFormState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const isTeamEvent = form.registration_type === "team";
  const isHackathonLike =
    form.event_type === "hackathon" || form.event_type === "hybrid";
  const isWorkshopLike =
    form.event_type === "workshop" || form.event_type === "hybrid";

  function validateJsonField(value: string, label: string) {
    if (!value.trim()) return null;

    try {
      JSON.parse(value);
      return null;
    } catch {
      return `${label} must be valid JSON.`;
    }
  }

  function validateForm() {
    if (!form.title.trim()) {
      return "Event title is required.";
    }

    if (isTeamEvent) {
      const min = Number(form.min_team_size);
      const max = Number(form.max_team_size);

      if (!form.min_team_size.trim() || !form.max_team_size.trim()) {
        return "Min team size and max team size are required for team events.";
      }

      if (!Number.isInteger(min) || !Number.isInteger(max)) {
        return "Min team size and max team size must be whole numbers.";
      }

      if (min < 1) {
        return "Min team size must be at least 1.";
      }

      if (max < min) {
        return "Max team size must be greater than or equal to min team size.";
      }

      if (form.requires_female_member) {
        const femaleCount = Number(form.required_female_count);

        if (!form.required_female_count.trim()) {
          return "Required female count is needed when female member rule is enabled.";
        }

        if (!Number.isInteger(femaleCount) || femaleCount < 1) {
          return "Required female count must be a whole number greater than or equal to 1.";
        }

        if (femaleCount > max) {
          return "Required female count cannot be greater than max team size.";
        }
      }
    }

    const scheduleJsonError = validateJsonField(form.schedule_json, "Schedule JSON");
    if (scheduleJsonError) return scheduleJsonError;

    const problemStatementsJsonError = validateJsonField(
      form.problem_statements_json,
      "Problem statements JSON"
    );
    if (problemStatementsJsonError) return problemStatementsJsonError;

    const judgingJsonError = validateJsonField(form.judging_json, "Judging JSON");
    if (judgingJsonError) return judgingJsonError;

    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || null,
        slug: form.slug.trim() || null,

        description: form.description.trim() || null,
        overview: form.overview.trim() || null,

        mode: form.mode,
        city: form.city.trim() || null,
        state: form.state.trim() || null,
        venue: form.venue.trim() || null,

        start_at: form.start_at || null,
        end_at: form.end_at || null,
        banner_url: form.banner_url.trim() || null,

        is_published: form.is_published,
        registration_open: form.registration_open,

        event_type: form.event_type,
        registration_type: form.registration_type,

        min_team_size: isTeamEvent ? Number(form.min_team_size) : null,
        max_team_size: isTeamEvent ? Number(form.max_team_size) : null,
        requires_female_member: isTeamEvent ? form.requires_female_member : false,
        required_female_count:
          isTeamEvent && form.requires_female_member
            ? Number(form.required_female_count)
            : null,
        role_based_team: isTeamEvent ? form.role_based_team : false,

        rules_markdown: form.rules_markdown.trim() || null,
        schedule_json: form.schedule_json.trim() || null,
        problem_statements_json: form.problem_statements_json.trim() || null,
        judging_json: form.judging_json.trim() || null,
      };

      const res = await fetch("/api/admin/events/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        alert(json?.error || "Failed to create event.");
        return;
      }

      router.push("/admin/events");
    } catch {
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Create Event</h1>
        <p className="text-sm text-foreground/60">
          Configure a workshop, hackathon, or hybrid event with structured rules
          and registration settings.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <section className={sectionClassName()}>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Basic information
          </h2>

          <div className="space-y-4">
            <input
              className={inputClassName()}
              placeholder="Event title"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              required
            />

            <input
              className={inputClassName()}
              placeholder="Subtitle"
              value={form.subtitle}
              onChange={(e) => update("subtitle", e.target.value)}
            />

            <input
              className={inputClassName()}
              placeholder="Custom slug (optional)"
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <select
                className={inputClassName()}
                value={form.event_type}
                onChange={(e) => update("event_type", e.target.value as EventType)}
              >
                <option value="workshop">Workshop</option>
                <option value="hackathon">Hackathon</option>
                <option value="hybrid">Hybrid</option>
              </select>

              <select
                className={inputClassName()}
                value={form.registration_type}
                onChange={(e) =>
                  update("registration_type", e.target.value as RegistrationType)
                }
              >
                <option value="individual">Individual</option>
                <option value="team">Team</option>
              </select>
            </div>

            <textarea
              className={textareaClassName()}
              placeholder="Overview"
              rows={5}
              value={form.overview}
              onChange={(e) => update("overview", e.target.value)}
            />

            <textarea
              className={textareaClassName()}
              placeholder="Narrative description"
              rows={5}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>
        </section>

        <section className={sectionClassName()}>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Venue and timing
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <select
                className={inputClassName()}
                value={form.mode}
                onChange={(e) => update("mode", e.target.value)}
              >
                <option value="offline">Offline</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </select>

              <input
                className={inputClassName()}
                placeholder="Venue"
                value={form.venue}
                onChange={(e) => update("venue", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                className={inputClassName()}
                placeholder="City"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
              />

              <input
                className={inputClassName()}
                placeholder="State"
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="datetime-local"
                className={inputClassName()}
                value={form.start_at}
                onChange={(e) => update("start_at", e.target.value)}
              />

              <input
                type="datetime-local"
                className={inputClassName()}
                value={form.end_at}
                onChange={(e) => update("end_at", e.target.value)}
              />
            </div>

            <input
              className={inputClassName()}
              placeholder="Banner image URL"
              value={form.banner_url}
              onChange={(e) => update("banner_url", e.target.value)}
            />
          </div>
        </section>

        <section className={sectionClassName()}>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Publishing and registration
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => update("is_published", e.target.checked)}
              />
              Publish event
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground">
              <input
                type="checkbox"
                checked={form.registration_open}
                onChange={(e) => update("registration_open", e.target.checked)}
              />
              Registration open
            </label>
          </div>
        </section>

        {isTeamEvent && (
          <section className={sectionClassName()}>
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Team configuration
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="number"
                  min={1}
                  step={1}
                  className={inputClassName()}
                  placeholder="Min team size"
                  value={form.min_team_size}
                  onChange={(e) => update("min_team_size", e.target.value)}
                />

                <input
                  type="number"
                  min={1}
                  step={1}
                  className={inputClassName()}
                  placeholder="Max team size"
                  value={form.max_team_size}
                  onChange={(e) => update("max_team_size", e.target.value)}
                />
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={form.requires_female_member}
                  onChange={(e) =>
                    update("requires_female_member", e.target.checked)
                  }
                />
                Require female members
              </label>

              {form.requires_female_member && (
                <input
                  type="number"
                  min={1}
                  step={1}
                  className={inputClassName()}
                  placeholder="Required female count"
                  value={form.required_female_count}
                  onChange={(e) =>
                    update("required_female_count", e.target.value)
                  }
                />
              )}

              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={form.role_based_team}
                  onChange={(e) => update("role_based_team", e.target.checked)}
                />
                Role-based team participation
              </label>
            </div>
          </section>
        )}

        {isWorkshopLike && (
          <section className={sectionClassName()}>
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Workshop content
            </h2>

            <div className="space-y-4">
              <textarea
                className={textareaClassName()}
                placeholder='Schedule JSON (example: [{"day":"Day 1","time":"9:30 AM","title":"Intro Session"}])'
                rows={8}
                value={form.schedule_json}
                onChange={(e) => update("schedule_json", e.target.value)}
              />
            </div>
          </section>
        )}

        {isHackathonLike && (
          <section className={sectionClassName()}>
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Hackathon content
            </h2>

            <div className="space-y-4">
              <textarea
                className={textareaClassName()}
                placeholder="Rules markdown"
                rows={6}
                value={form.rules_markdown}
                onChange={(e) => update("rules_markdown", e.target.value)}
              />

              <textarea
                className={textareaClassName()}
                placeholder='Problem statements JSON (example: [{"title":"Water Access","difficulty":"Beginner","summary":"Build a solution..."}])'
                rows={8}
                value={form.problem_statements_json}
                onChange={(e) =>
                  update("problem_statements_json", e.target.value)
                }
              />

              <textarea
                className={textareaClassName()}
                placeholder='Judging JSON (example: [{"criterion":"Impact","weight":"30%"}])'
                rows={8}
                value={form.judging_json}
                onChange={(e) => update("judging_json", e.target.value)}
              />

              {!isWorkshopLike && (
                <textarea
                  className={textareaClassName()}
                  placeholder='Schedule JSON (example: [{"time":"10:00 AM","title":"Hackathon Kickoff"}])'
                  rows={8}
                  value={form.schedule_json}
                  onChange={(e) => update("schedule_json", e.target.value)}
                />
              )}
            </div>
          </section>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition hover:bg-background/60 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => router.push("/admin/events")}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground/80 transition hover:bg-white/10 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}