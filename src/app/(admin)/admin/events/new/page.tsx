"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

type EventType = "workshop" | "hackathon" | "hybrid";
type RegistrationType = "individual" | "team";

type ScheduleItem = {
  day: string;
  time: string;
  title: string;
};

type ProblemStatementItem = {
  title: string;
  summary: string;
};

type JudgingItem = {
  criterion: string;
  weight: string;
};

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

  fee: string;
  prize_pool: string;
  winner_prize: string;
  runner_prize: string;
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

function rowCardClassName() {
  return "rounded-xl border border-white/10 bg-white/5 p-4";
}

function removeEmptyScheduleRows(items: ScheduleItem[]) {
  return items
    .map((item) => ({
      day: item.day.trim(),
      time: item.time.trim(),
      title: item.title.trim(),
    }))
    .filter((item) => item.day || item.time || item.title);
}

function removeEmptyProblemRows(items: ProblemStatementItem[]) {
  return items
    .map((item) => ({
      title: item.title.trim(),
      summary: item.summary.trim(),
    }))
    .filter((item) => item.title || item.summary);
}

function removeEmptyJudgingRows(items: JudgingItem[]) {
  return items
    .map((item) => ({
      criterion: item.criterion.trim(),
      weight: item.weight.trim(),
    }))
    .filter((item) => item.criterion || item.weight);
}

function removeEmptyStringRows(items: string[]) {
  return items.map((item) => item.trim()).filter(Boolean);
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

    fee: "",
    prize_pool: "",
    winner_prize: "",
    runner_prize: "",
  });

  const [schedule, setSchedule] = React.useState<ScheduleItem[]>([
    { day: "", time: "", title: "" },
  ]);

  const [problemStatements, setProblemStatements] = React.useState<
    ProblemStatementItem[]
  >([{ title: "", summary: "" }]);

  const [judgingCriteria, setJudgingCriteria] = React.useState<JudgingItem[]>([
    { criterion: "", weight: "" },
  ]);

  const [benefits, setBenefits] = React.useState<string[]>([""]);
  const [sampleRoles, setSampleRoles] = React.useState<string[]>([""]);

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

      const cleanSchedule = removeEmptyScheduleRows(schedule);
      const cleanProblems = removeEmptyProblemRows(problemStatements);
      const cleanJudging = removeEmptyJudgingRows(judgingCriteria);
      const cleanBenefits = removeEmptyStringRows(benefits);
      const cleanRoles = removeEmptyStringRows(sampleRoles);

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

        schedule_json: cleanSchedule.length ? cleanSchedule : null,
        problem_statements_json: cleanProblems.length ? cleanProblems : null,
        judging_json: cleanJudging.length ? cleanJudging : null,

        fee: form.fee.trim() || null,
        prize_pool: form.prize_pool.trim() || null,
        winner_prize: form.winner_prize.trim() || null,
        runner_prize: form.runner_prize.trim() || null,

        benefits_json: cleanBenefits.length ? cleanBenefits : null,
        sample_roles_json:
          isTeamEvent && cleanRoles.length ? cleanRoles : null,
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
          Configure a workshop, hackathon, or hybrid event with structured rules,
          schedule, judging, pricing, and team settings.
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

        <section className={sectionClassName()}>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">Schedule</h2>
            <p className="mt-1 text-sm text-foreground/60">
              Add the event flow using day, time, and session title.
            </p>
          </div>

          <div className="space-y-3">
            {schedule.map((item, index) => (
              <div key={index} className={rowCardClassName()}>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_2fr_auto]">
                  <input
                    className={inputClassName()}
                    placeholder="Day"
                    value={item.day}
                    onChange={(e) => {
                      const next = [...schedule];
                      next[index] = { ...next[index], day: e.target.value };
                      setSchedule(next);
                    }}
                  />

                  <input
                    className={inputClassName()}
                    placeholder="Time"
                    value={item.time}
                    onChange={(e) => {
                      const next = [...schedule];
                      next[index] = { ...next[index], time: e.target.value };
                      setSchedule(next);
                    }}
                  />

                  <input
                    className={inputClassName()}
                    placeholder="Session title"
                    value={item.title}
                    onChange={(e) => {
                      const next = [...schedule];
                      next[index] = { ...next[index], title: e.target.value };
                      setSchedule(next);
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setSchedule((prev) =>
                        prev.length === 1
                          ? [{ day: "", time: "", title: "" }]
                          : prev.filter((_, i) => i !== index)
                      )
                    }
                    className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setSchedule((prev) => [
                  ...prev,
                  { day: "", time: "", title: "" },
                ])
              }
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground"
            >
              + Add schedule row
            </button>
          </div>
        </section>

        {isHackathonLike && (
          <section className={sectionClassName()}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Hackathon content
              </h2>
              <p className="mt-1 text-sm text-foreground/60">
                Add rules, challenge statements, judging, pricing, and benefits.
              </p>
            </div>

            <div className="space-y-5">
              <textarea
                className={textareaClassName()}
                placeholder="Rules markdown / plain text"
                rows={6}
                value={form.rules_markdown}
                onChange={(e) => update("rules_markdown", e.target.value)}
              />

              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    Problem statements
                  </h3>
                  <p className="mt-1 text-xs text-foreground/55">
                    These will be saved in admin JSON format using title and summary.
                  </p>
                </div>

                {problemStatements.map((item, index) => (
                  <div key={index} className={rowCardClassName()}>
                    <div className="space-y-3">
                      <input
                        className={inputClassName()}
                        placeholder="Problem title"
                        value={item.title}
                        onChange={(e) => {
                          const next = [...problemStatements];
                          next[index] = { ...next[index], title: e.target.value };
                          setProblemStatements(next);
                        }}
                      />

                      <textarea
                        className={textareaClassName()}
                        placeholder="Problem summary"
                        rows={4}
                        value={item.summary}
                        onChange={(e) => {
                          const next = [...problemStatements];
                          next[index] = {
                            ...next[index],
                            summary: e.target.value,
                          };
                          setProblemStatements(next);
                        }}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setProblemStatements((prev) =>
                            prev.length === 1
                              ? [{ title: "", summary: "" }]
                              : prev.filter((_, i) => i !== index)
                          )
                        }
                        className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setProblemStatements((prev) => [
                      ...prev,
                      { title: "", summary: "" },
                    ])
                  }
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground"
                >
                  + Add problem statement
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    Judging criteria
                  </h3>
                </div>

                {judgingCriteria.map((item, index) => (
                  <div key={index} className={rowCardClassName()}>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr_auto]">
                      <input
                        className={inputClassName()}
                        placeholder="Criterion"
                        value={item.criterion}
                        onChange={(e) => {
                          const next = [...judgingCriteria];
                          next[index] = {
                            ...next[index],
                            criterion: e.target.value,
                          };
                          setJudgingCriteria(next);
                        }}
                      />

                      <input
                        className={inputClassName()}
                        placeholder="Weight"
                        value={item.weight}
                        onChange={(e) => {
                          const next = [...judgingCriteria];
                          next[index] = {
                            ...next[index],
                            weight: e.target.value,
                          };
                          setJudgingCriteria(next);
                        }}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setJudgingCriteria((prev) =>
                            prev.length === 1
                              ? [{ criterion: "", weight: "" }]
                              : prev.filter((_, i) => i !== index)
                          )
                        }
                        className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setJudgingCriteria((prev) => [
                      ...prev,
                      { criterion: "", weight: "" },
                    ])
                  }
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground"
                >
                  + Add judging criterion
                </button>
              </div>
            </div>
          </section>
        )}

        {(isWorkshopLike || isHackathonLike) && (
          <section className={sectionClassName()}>
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Pricing and rewards
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                className={inputClassName()}
                placeholder="Registration fee"
                value={form.fee}
                onChange={(e) => update("fee", e.target.value)}
              />

              <input
                className={inputClassName()}
                placeholder="Prize pool"
                value={form.prize_pool}
                onChange={(e) => update("prize_pool", e.target.value)}
              />

              <input
                className={inputClassName()}
                placeholder="Winner prize"
                value={form.winner_prize}
                onChange={(e) => update("winner_prize", e.target.value)}
              />

              <input
                className={inputClassName()}
                placeholder="Runner prize"
                value={form.runner_prize}
                onChange={(e) => update("runner_prize", e.target.value)}
              />
            </div>
          </section>
        )}

        <section className={sectionClassName()}>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">Benefits</h2>
            <p className="mt-1 text-sm text-foreground/60">
              Add participant benefits like certificates, networking, mentorship, or swag.
            </p>
          </div>

          <div className="space-y-3">
            {benefits.map((item, index) => (
              <div key={index} className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
                <input
                  className={inputClassName()}
                  placeholder="Benefit"
                  value={item}
                  onChange={(e) => {
                    const next = [...benefits];
                    next[index] = e.target.value;
                    setBenefits(next);
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setBenefits((prev) =>
                      prev.length === 1 ? [""] : prev.filter((_, i) => i !== index)
                    )
                  }
                  className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setBenefits((prev) => [...prev, ""])}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground"
            >
              + Add benefit
            </button>
          </div>
        </section>

        {isTeamEvent && (
          <section className={sectionClassName()}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Sample team roles
              </h2>
              <p className="mt-1 text-sm text-foreground/60">
                Add suggested roles for role-based or hackathon teams.
              </p>
            </div>

            <div className="space-y-3">
              {sampleRoles.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]"
                >
                  <input
                    className={inputClassName()}
                    placeholder="Role"
                    value={item}
                    onChange={(e) => {
                      const next = [...sampleRoles];
                      next[index] = e.target.value;
                      setSampleRoles(next);
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setSampleRoles((prev) =>
                        prev.length === 1 ? [""] : prev.filter((_, i) => i !== index)
                      )
                    }
                    className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setSampleRoles((prev) => [...prev, ""])}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground"
              >
                + Add role
              </button>
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