"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";

type EventType = "workshop" | "hackathon" | "hybrid";
type RegistrationType = "individual" | "team";

type EventRecord = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  overview: string | null;

  mode: string | null;
  venue: string | null;
  city: string | null;
  state: string | null;

  start_at: string | null;
  end_at: string | null;

  banner_url: string | null;

  is_published: boolean;
  registration_open: boolean;

  event_type: EventType;
  registration_type: RegistrationType;

  min_team_size: number | null;
  max_team_size: number | null;
  requires_female_member: boolean | null;
  required_female_count: number | null;
  role_based_team: boolean | null;

  rules_markdown: string | null;
  schedule_json: unknown | null;
  problem_statements_json: unknown | null;
  judging_json: unknown | null;

  created_at?: string | null;
  updated_at?: string | null;
};

type FormState = {
  title: string;
  subtitle: string;
  slug: string;

  description: string;
  overview: string;

  mode: string;
  venue: string;
  city: string;
  state: string;

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

function toInputDateTime(value: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

function toISOStringOrNull(localValue: string) {
  const v = localValue.trim();
  if (!v) return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function stringifyJson(value: unknown) {
  if (value == null) return "";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "";
  }
}

function inputClassName() {
  return "w-full rounded-xl border border-border bg-background/40 px-3 py-2 text-sm text-foreground outline-none";
}

function textareaClassName() {
  return "w-full rounded-xl border border-border bg-background/40 px-3 py-2 text-sm text-foreground outline-none";
}

function sectionClassName() {
  return "rounded-2xl border border-border bg-card p-5";
}

export default function AdminEventEditPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const [event, setEvent] = React.useState<EventRecord | null>(null);

  const [form, setForm] = React.useState<FormState>({
    title: "",
    subtitle: "",
    slug: "",

    description: "",
    overview: "",

    mode: "offline",
    venue: "",
    city: "",
    state: "",

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

  function patchForm(p: Partial<FormState>) {
    setForm((f) => ({ ...f, ...p }));
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
      return "Title is required.";
    }

    if (!form.slug.trim()) {
      return "Slug is required.";
    }

    if (isTeamEvent) {
      if (!form.min_team_size.trim() || !form.max_team_size.trim()) {
        return "Min team size and max team size are required for team events.";
      }

      const min = Number(form.min_team_size);
      const max = Number(form.max_team_size);

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
        if (!form.required_female_count.trim()) {
          return "Required female count is needed when female member rule is enabled.";
        }

        const femaleCount = Number(form.required_female_count);

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

  async function loadEvent() {
    if (!id) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/admin/events/${encodeURIComponent(id)}`, {
        method: "GET",
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        alert(json?.error || "Failed to load event");
        return;
      }

      const e = json.data as EventRecord;
      setEvent(e);

      patchForm({
        title: e.title ?? "",
        subtitle: e.subtitle ?? "",
        slug: e.slug ?? "",

        description: e.description ?? "",
        overview: e.overview ?? "",

        mode: e.mode ?? "offline",
        venue: e.venue ?? "",
        city: e.city ?? "",
        state: e.state ?? "",

        start_at: toInputDateTime(e.start_at),
        end_at: toInputDateTime(e.end_at),

        banner_url: e.banner_url ?? "",

        is_published: Boolean(e.is_published),
        registration_open: Boolean(e.registration_open),

        event_type: e.event_type ?? "workshop",
        registration_type: e.registration_type ?? "individual",

        min_team_size: e.min_team_size == null ? "" : String(e.min_team_size),
        max_team_size: e.max_team_size == null ? "" : String(e.max_team_size),
        requires_female_member: Boolean(e.requires_female_member),
        required_female_count:
          e.required_female_count == null ? "" : String(e.required_female_count),
        role_based_team: Boolean(e.role_based_team),

        rules_markdown: e.rules_markdown ?? "",
        schedule_json: stringifyJson(e.schedule_json),
        problem_statements_json: stringifyJson(e.problem_statements_json),
        judging_json: stringifyJson(e.judging_json),
      });
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!id) return;

    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || null,
        slug: form.slug.trim(),

        description: form.description.trim() || null,
        overview: form.overview.trim() || null,

        mode: form.mode.trim() || null,
        venue: form.venue.trim() || null,
        city: form.city.trim() || null,
        state: form.state.trim() || null,

        start_at: toISOStringOrNull(form.start_at),
        end_at: toISOStringOrNull(form.end_at),

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

      const res = await fetch(`/api/admin/events/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        alert(json?.error || "Failed to save event");
        return;
      }

      const next = json.data as EventRecord;
      setEvent(next);

      patchForm({
        title: next.title ?? "",
        subtitle: next.subtitle ?? "",
        slug: next.slug ?? "",

        description: next.description ?? "",
        overview: next.overview ?? "",

        mode: next.mode ?? "offline",
        venue: next.venue ?? "",
        city: next.city ?? "",
        state: next.state ?? "",

        start_at: toInputDateTime(next.start_at),
        end_at: toInputDateTime(next.end_at),

        banner_url: next.banner_url ?? "",

        is_published: Boolean(next.is_published),
        registration_open: Boolean(next.registration_open),

        event_type: next.event_type ?? "workshop",
        registration_type: next.registration_type ?? "individual",

        min_team_size:
          next.min_team_size == null ? "" : String(next.min_team_size),
        max_team_size:
          next.max_team_size == null ? "" : String(next.max_team_size),
        requires_female_member: Boolean(next.requires_female_member),
        required_female_count:
          next.required_female_count == null
            ? ""
            : String(next.required_female_count),
        role_based_team: Boolean(next.role_based_team),

        rules_markdown: next.rules_markdown ?? "",
        schedule_json: stringifyJson(next.schedule_json),
        problem_statements_json: stringifyJson(next.problem_statements_json),
        judging_json: stringifyJson(next.judging_json),
      });

      alert("Saved");
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setSaving(false);
    }
  }

  React.useEffect(() => {
    loadEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!id) {
    return <div className="p-6 text-sm text-foreground/60">Missing event id.</div>;
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">Edit Event</h1>
          <p className="text-sm text-foreground/60">
            Update structured event content, registration rules, and publishing state.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-xl border border-border bg-background/40 px-4 py-2 text-xs hover:bg-background/60 disabled:opacity-50"
            disabled={saving || loading}
            onClick={() => router.push("/admin/events")}
          >
            Back
          </button>

          <a
            className="rounded-xl border border-border bg-background/40 px-4 py-2 text-xs hover:bg-background/60"
            href={event ? `/events/${encodeURIComponent(event.slug)}` : "#"}
            target="_blank"
            rel="noreferrer"
          >
            View
          </a>

          <button
            className="rounded-xl border border-border bg-background/40 px-4 py-2 text-xs hover:bg-background/60 disabled:opacity-50"
            disabled={saving || loading}
            onClick={save}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <section className={sectionClassName()}>
        {loading ? (
          <div className="text-sm text-foreground/60">Loading event…</div>
        ) : !event ? (
          <div className="text-sm text-foreground/60">Event not found.</div>
        ) : (
          <div className="space-y-6">
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Basic information</h2>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-1">
                  <span className="text-xs text-foreground/60">Title *</span>
                  <input
                    className={inputClassName()}
                    value={form.title}
                    onChange={(e) => patchForm({ title: e.target.value })}
                    placeholder="Event title"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs text-foreground/60">Subtitle</span>
                  <input
                    className={inputClassName()}
                    value={form.subtitle}
                    onChange={(e) => patchForm({ subtitle: e.target.value })}
                    placeholder="Short supporting line"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs text-foreground/60">Slug *</span>
                  <input
                    className={inputClassName()}
                    value={form.slug}
                    onChange={(e) => patchForm({ slug: e.target.value })}
                    placeholder="sdg-innovation-workshop"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs text-foreground/60">Event Type</span>
                  <select
                    className={inputClassName()}
                    value={form.event_type}
                    onChange={(e) =>
                      patchForm({ event_type: e.target.value as EventType })
                    }
                  >
                    <option value="workshop">Workshop</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </label>

                <label className="grid gap-1">
                  <span className="text-xs text-foreground/60">Mode</span>
                  <select
                    className={inputClassName()}
                    value={form.mode}
                    onChange={(e) => patchForm({ mode: e.target.value })}
                  >
                    <option value="offline">Offline</option>
                    <option value="online">Online</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </label>

                <label className="grid gap-1">
                  <span className="text-xs text-foreground/60">Registration Type</span>
                  <select
                    className={inputClassName()}
                    value={form.registration_type}
                    onChange={(e) =>
                      patchForm({
                        registration_type: e.target.value as RegistrationType,
                      })
                    }
                  >
                    <option value="individual">Individual</option>
                    <option value="team">Team</option>
                  </select>
                </label>

                <label className="grid gap-1 md:col-span-2">
                  <span className="text-xs text-foreground/60">Overview</span>
                  <textarea
                    className={`${textareaClassName()} min-h-32`}
                    value={form.overview}
                    onChange={(e) => patchForm({ overview: e.target.value })}
                    placeholder="Structured public overview"
                  />
                </label>

                <label className="grid gap-1 md:col-span-2">
                  <span className="text-xs text-foreground/60">Description</span>
                  <textarea
                    className={`${textareaClassName()} min-h-32`}
                    value={form.description}
                    onChange={(e) => patchForm({ description: e.target.value })}
                    placeholder="Narrative description"
                  />
                </label>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Venue and timing</h2>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-1">
                  <span className="text-xs text-foreground/60">Venue</span>
                  <input
                    className={inputClassName()}
                    value={form.venue}
                    onChange={(e) => patchForm({ venue: e.target.value })}
                    placeholder="College / Hall / Zoom"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs text-foreground/60">Banner URL</span>
                  <input
                    className={inputClassName()}
                    value={form.banner_url}
                    onChange={(e) => patchForm({ banner_url: e.target.value })}
                    placeholder="https://..."
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs text-foreground/60">City</span>
                  <input
                    className={inputClassName()}
                    value={form.city}
                    onChange={(e) => patchForm({ city: e.target.value })}
                    placeholder="Hyderabad"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs text-foreground/60">State</span>
                  <input
                    className={inputClassName()}
                    value={form.state}
                    onChange={(e) => patchForm({ state: e.target.value })}
                    placeholder="Telangana"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs text-foreground/60">Start</span>
                  <input
                    type="datetime-local"
                    className={inputClassName()}
                    value={form.start_at}
                    onChange={(e) => patchForm({ start_at: e.target.value })}
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs text-foreground/60">End</span>
                  <input
                    type="datetime-local"
                    className={inputClassName()}
                    value={form.end_at}
                    onChange={(e) => patchForm({ end_at: e.target.value })}
                  />
                </label>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Publishing and registration
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) => patchForm({ is_published: e.target.checked })}
                  />
                  Publish event
                </label>

                <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={form.registration_open}
                    onChange={(e) =>
                      patchForm({ registration_open: e.target.checked })
                    }
                  />
                  Registration open
                </label>
              </div>
            </section>

            {isTeamEvent && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Team configuration
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-1">
                    <span className="text-xs text-foreground/60">Min Team Size</span>
                    <input
                      type="number"
                      min={1}
                      step={1}
                      className={inputClassName()}
                      value={form.min_team_size}
                      onChange={(e) =>
                        patchForm({ min_team_size: e.target.value })
                      }
                    />
                  </label>

                  <label className="grid gap-1">
                    <span className="text-xs text-foreground/60">Max Team Size</span>
                    <input
                      type="number"
                      min={1}
                      step={1}
                      className={inputClassName()}
                      value={form.max_team_size}
                      onChange={(e) =>
                        patchForm({ max_team_size: e.target.value })
                      }
                    />
                  </label>
                </div>

                <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={form.requires_female_member}
                    onChange={(e) =>
                      patchForm({ requires_female_member: e.target.checked })
                    }
                  />
                  Require female members
                </label>

                {form.requires_female_member && (
                  <label className="grid gap-1">
                    <span className="text-xs text-foreground/60">
                      Required Female Count
                    </span>
                    <input
                      type="number"
                      min={1}
                      step={1}
                      className={inputClassName()}
                      value={form.required_female_count}
                      onChange={(e) =>
                        patchForm({ required_female_count: e.target.value })
                      }
                    />
                  </label>
                )}

                <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={form.role_based_team}
                    onChange={(e) =>
                      patchForm({ role_based_team: e.target.checked })
                    }
                  />
                  Role-based team participation
                </label>
              </section>
            )}

            {isWorkshopLike && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Workshop content
                </h2>

                <label className="grid gap-1">
                  <span className="text-xs text-foreground/60">Schedule JSON</span>
                  <textarea
                    className={`${textareaClassName()} min-h-40 font-mono`}
                    value={form.schedule_json}
                    onChange={(e) => patchForm({ schedule_json: e.target.value })}
                    placeholder='[{"day":"Day 1","time":"9:30 AM","title":"Intro Session"}]'
                  />
                </label>
              </section>
            )}

            {isHackathonLike && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Hackathon content
                </h2>

                <label className="grid gap-1">
                  <span className="text-xs text-foreground/60">Rules Markdown</span>
                  <textarea
                    className={`${textareaClassName()} min-h-32`}
                    value={form.rules_markdown}
                    onChange={(e) =>
                      patchForm({ rules_markdown: e.target.value })
                    }
                    placeholder="Participation rules"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs text-foreground/60">
                    Problem Statements JSON
                  </span>
                  <textarea
                    className={`${textareaClassName()} min-h-40 font-mono`}
                    value={form.problem_statements_json}
                    onChange={(e) =>
                      patchForm({ problem_statements_json: e.target.value })
                    }
                    placeholder='[{"title":"Water Access","difficulty":"Beginner","summary":"Build a solution..."}]'
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs text-foreground/60">Judging JSON</span>
                  <textarea
                    className={`${textareaClassName()} min-h-40 font-mono`}
                    value={form.judging_json}
                    onChange={(e) => patchForm({ judging_json: e.target.value })}
                    placeholder='[{"criterion":"Impact","weight":"30%"}]'
                  />
                </label>

                {!isWorkshopLike && (
                  <label className="grid gap-1">
                    <span className="text-xs text-foreground/60">Schedule JSON</span>
                    <textarea
                      className={`${textareaClassName()} min-h-40 font-mono`}
                      value={form.schedule_json}
                      onChange={(e) =>
                        patchForm({ schedule_json: e.target.value })
                      }
                      placeholder='[{"time":"10:00 AM","title":"Hackathon Kickoff"}]'
                    />
                  </label>
                )}
              </section>
            )}

            <div className="rounded-xl border border-border bg-background/30 px-3 py-2 text-xs text-foreground/60">
              <div>ID: {event.id}</div>
              <div>Status: {form.is_published ? "Published" : "Draft"}</div>
              <div>Registration: {form.registration_open ? "Open" : "Closed"}</div>
              <div>Event Type: {form.event_type}</div>
              <div>Registration Type: {form.registration_type}</div>
              {isTeamEvent &&
              form.min_team_size.trim() &&
              form.max_team_size.trim() ? (
                <div>
                  Team Size: {form.min_team_size} - {form.max_team_size}
                </div>
              ) : null}
              {event.updated_at ? (
                <div>Updated: {new Date(event.updated_at).toLocaleString()}</div>
              ) : null}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}