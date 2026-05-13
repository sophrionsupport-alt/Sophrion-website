"use client";

import * as React from "react";

type EventRegistrationProps = {
  event: {
    slug: string;
    registration_open: boolean;
    registration_type: "individual" | "team" | "both";
    min_team_size: number | null;
    max_team_size: number | null;
    requires_female_member: boolean | null;
    required_female_count: number | null;
    role_based_team: boolean | null;
  };
};

type TeamMemberDraft = {
  name: string;
  email: string;
  phone: string;
  college: string;
  gender: string;
  role: string;
};

const emptyMember = (): TeamMemberDraft => ({
  name: "",
  email: "",
  phone: "",
  college: "",
  gender: "",
  role: "",
});

export default function EventRegistrationSection({ event }: EventRegistrationProps) {
  const [tab, setTab] = React.useState<"individual" | "team">(
    event.registration_type === "team" ? "team" : "individual"
  );

  const [status, setStatus] = React.useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});

  const minTeam = Math.max(1, event.min_team_size ?? 1);
  const maxTeam = Math.max(minTeam, event.max_team_size ?? minTeam);

  const [indiv, setIndiv] = React.useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    year: "",
    roll_number: "",
  });

  const [team, setTeam] = React.useState({
    team_name: "",
    leader_name: "",
    leader_email: "",
    leader_phone: "",
    leader_gender: "",
    leader_role: "",
    college: "",
  });

  const [members, setMembers] = React.useState<TeamMemberDraft[]>(() => {
    const slots = Math.max(0, minTeam - 1);
    return Array.from({ length: slots }, () => emptyMember());
  });

  React.useEffect(() => {
    const slots = Math.max(0, minTeam - 1);
    setMembers((prev) => {
      if (prev.length === slots) return prev;
      if (prev.length < slots) {
        return [...prev, ...Array.from({ length: slots - prev.length }, () => emptyMember())];
      }
      return prev.slice(0, slots);
    });
  }, [minTeam]);

  if (!event.registration_open) {
    return (
      <p className="text-sm text-foreground/65">
        Registrations are currently closed for this event.
      </p>
    );
  }

  async function submitIndividual(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    setFieldErrors({});

    try {
      const res = await fetch(`/api/public/events/${encodeURIComponent(event.slug)}/register`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: indiv.name,
          email: indiv.email,
          phone: indiv.phone,
          college: indiv.college,
          year: indiv.year,
          roll_number: indiv.roll_number || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || json?.ok === false) {
        setStatus("error");
        setMessage(json?.error || "Registration failed");
        if (json?.fieldErrors && typeof json.fieldErrors === "object") {
          setFieldErrors(json.fieldErrors as Record<string, string>);
        }
        return;
      }
      setStatus("done");
      setMessage(json?.message || "You’re registered. Check your email for details.");
    } catch {
      setStatus("error");
      setMessage("Network error");
    }
  }

  function setMember(i: number, patch: Partial<TeamMemberDraft>) {
    setMembers((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], ...patch };
      return next;
    });
  }

  async function submitTeam(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    setFieldErrors({});

    const body = {
      team_name: team.team_name,
      leader_name: team.leader_name,
      leader_email: team.leader_email,
      leader_phone: team.leader_phone,
      leader_gender: team.leader_gender,
      leader_role: team.leader_role,
      college: team.college,
      members: members.map((m) => ({
        name: m.name,
        email: m.email,
        phone: m.phone,
        college: m.college || team.college,
        gender: m.gender,
        role: m.role,
      })),
    };

    try {
      const res = await fetch(
        `/api/public/events/${encodeURIComponent(event.slug)}/register-team`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const json = await res.json();
      if (!res.ok || json?.ok === false) {
        setStatus("error");
        setMessage(json?.error || "Registration failed");
        if (json?.fieldErrors && typeof json.fieldErrors === "object") {
          setFieldErrors(json.fieldErrors as Record<string, string>);
        }
        return;
      }
      setStatus("done");
      setMessage(json?.message || "Team registered successfully.");
    } catch {
      setStatus("error");
      setMessage("Network error");
    }
  }

  const showTabs = event.registration_type === "both";

  return (
    <div className="space-y-4">
      {showTabs ? (
        <div className="flex gap-2 rounded-xl border border-border p-1 text-xs">
          <button
            type="button"
            className={`flex-1 rounded-lg px-2 py-1.5 ${
              tab === "individual" ? "bg-foreground text-background" : ""
            }`}
            onClick={() => setTab("individual")}
          >
            Individual
          </button>
          <button
            type="button"
            className={`flex-1 rounded-lg px-2 py-1.5 ${
              tab === "team" ? "bg-foreground text-background" : ""
            }`}
            onClick={() => setTab("team")}
          >
            Team
          </button>
        </div>
      ) : null}

      {event.registration_type === "individual" || (showTabs && tab === "individual") ? (
        <form className="space-y-3 text-sm" onSubmit={submitIndividual}>
          {(["name", "email", "phone", "college", "year"] as const).map((field) => (
            <label key={field} className="block space-y-1">
              <span className="text-foreground/70 capitalize">{field === "name" ? "Full name" : field}</span>
              <input
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
                value={indiv[field] as string}
                onChange={(e) => setIndiv((p) => ({ ...p, [field]: e.target.value }))}
              />
              {fieldErrors[field] ? (
                <span className="text-xs text-red-400">{fieldErrors[field]}</span>
              ) : null}
            </label>
          ))}
          <label className="block space-y-1">
            <span className="text-foreground/70">Roll number (optional)</span>
            <input
              className="w-full rounded-lg border border-border bg-background px-3 py-2"
              value={indiv.roll_number}
              onChange={(e) => setIndiv((p) => ({ ...p, roll_number: e.target.value }))}
            />
          </label>
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-xl bg-foreground py-2 text-background disabled:opacity-50"
          >
            {status === "loading" ? "Submitting…" : "Register"}
          </button>
        </form>
      ) : null}

      {event.registration_type === "team" || (showTabs && tab === "team") ? (
        <form className="space-y-3 text-sm" onSubmit={submitTeam}>
          <label className="block space-y-1">
            <span className="text-foreground/70">Team name</span>
            <input
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2"
              value={team.team_name}
              onChange={(e) => setTeam((t) => ({ ...t, team_name: e.target.value }))}
            />
            {fieldErrors.team_name ? (
              <span className="text-xs text-red-400">{fieldErrors.team_name}</span>
            ) : null}
          </label>
          <div className="grid gap-2 md:grid-cols-2">
            {(
              [
                ["leader_name", "Leader name"],
                ["leader_email", "Leader email"],
                ["leader_phone", "Leader phone"],
                ["college", "College / institution"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block space-y-1">
                <span className="text-foreground/70">{label}</span>
                <input
                  required
                  type={key === "leader_email" ? "email" : "text"}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2"
                  value={team[key]}
                  onChange={(e) => setTeam((t) => ({ ...t, [key]: e.target.value }))}
                />
                {fieldErrors[key] ? (
                  <span className="text-xs text-red-400">{fieldErrors[key]}</span>
                ) : null}
              </label>
            ))}
          </div>
          {event.requires_female_member ? (
            <label className="block space-y-1">
              <span className="text-foreground/70">Leader gender</span>
              <select
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
                value={team.leader_gender}
                onChange={(e) => setTeam((t) => ({ ...t, leader_gender: e.target.value }))}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
              {fieldErrors.leader_gender ? (
                <span className="text-xs text-red-400">{fieldErrors.leader_gender}</span>
              ) : null}
            </label>
          ) : null}
          {event.role_based_team ? (
            <label className="block space-y-1">
              <span className="text-foreground/70">Leader role</span>
              <input
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
                value={team.leader_role}
                onChange={(e) => setTeam((t) => ({ ...t, leader_role: e.target.value }))}
              />
              {fieldErrors.leader_role ? (
                <span className="text-xs text-red-400">{fieldErrors.leader_role}</span>
              ) : null}
            </label>
          ) : null}

          <div className="border-t border-border pt-3">
            <div className="mb-2 text-xs text-foreground/60">
              Team size: {1 + members.length} (min {minTeam}, max {maxTeam})
            </div>
            {members.map((m, i) => (
              <div key={i} className="mb-4 rounded-xl border border-border/60 p-3">
                <div className="mb-2 text-xs font-medium text-foreground/80">Member {i + 1}</div>
                <div className="grid gap-2 md:grid-cols-2">
                  <input
                    required
                    placeholder="Name"
                    className="rounded-lg border border-border bg-background px-3 py-2"
                    value={m.name}
                    onChange={(e) => setMember(i, { name: e.target.value })}
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    className="rounded-lg border border-border bg-background px-3 py-2"
                    value={m.email}
                    onChange={(e) => setMember(i, { email: e.target.value })}
                  />
                  <input
                    required
                    placeholder="Phone"
                    className="rounded-lg border border-border bg-background px-3 py-2"
                    value={m.phone}
                    onChange={(e) => setMember(i, { phone: e.target.value })}
                  />
                  <input
                    placeholder="College (optional if same as leader)"
                    className="rounded-lg border border-border bg-background px-3 py-2"
                    value={m.college}
                    onChange={(e) => setMember(i, { college: e.target.value })}
                  />
                  {event.requires_female_member ? (
                    <select
                      required
                      className="rounded-lg border border-border bg-background px-3 py-2"
                      value={m.gender}
                      onChange={(e) => setMember(i, { gender: e.target.value })}
                    >
                      <option value="">Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  ) : null}
                  {event.role_based_team ? (
                    <input
                      required
                      placeholder="Role"
                      className="rounded-lg border border-border bg-background px-3 py-2"
                      value={m.role}
                      onChange={(e) => setMember(i, { role: e.target.value })}
                    />
                  ) : null}
                </div>
              </div>
            ))}
            {1 + members.length < maxTeam ? (
              <button
                type="button"
                className="text-xs underline"
                onClick={() => setMembers((prev) => [...prev, emptyMember()])}
              >
                Add team member
              </button>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-xl bg-foreground py-2 text-background disabled:opacity-50"
          >
            {status === "loading" ? "Submitting…" : "Register team"}
          </button>
        </form>
      ) : null}

      {message ? (
        <p
          className={`text-xs ${
            status === "error" ? "text-red-400" : "text-emerald-400"
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
