"use client";

import * as React from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type ApiOk<T = unknown> = { ok: true; data?: T; message?: string };
type ApiFail = {
  ok: false;
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string>;
};
type ApiResp<T = unknown> = ApiOk<T> | ApiFail;

type TeamMember = {
  name: string;
  email: string;
  phone: string;
  gender: string;
  role: string;
};

type Props = {
  slug: string;
  minTeamSize?: number | null;
  maxTeamSize?: number | null;
  requiresFemaleMember?: boolean;
  requiredFemaleCount?: number | null;
  roleBasedTeam?: boolean;
};

type Step = 1 | 2 | 3 | 4;

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function createEmptyMember(): TeamMember {
  return {
    name: "",
    email: "",
    phone: "",
    gender: "",
    role: "",
  };
}

function getErrMessage(payload: ApiResp | null | undefined) {
  if (!payload || payload.ok) {
    return "Team registration failed. Please try again.";
  }

  return (
    payload.error ||
    payload.message ||
    "Team registration failed. Please try again."
  );
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export default function EventTeamRegisterForm({
  slug,
  minTeamSize,
  maxTeamSize,
  requiresFemaleMember = false,
  requiredFemaleCount,
  roleBasedTeam = false,
}: Props) {
  const [step, setStep] = React.useState<Step>(1);

  const [teamName, setTeamName] = React.useState("");
  const [leaderName, setLeaderName] = React.useState("");
  const [leaderEmail, setLeaderEmail] = React.useState("");
  const [leaderPhone, setLeaderPhone] = React.useState("");
  const [leaderGender, setLeaderGender] = React.useState("");
  const [leaderRole, setLeaderRole] = React.useState("");
  const [college, setCollege] = React.useState("");

  const [members, setMembers] = React.useState<TeamMember[]>([
    createEmptyMember(),
  ]);

  const [loading, setLoading] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>(
    {}
  );

  const effectiveMin = Math.max(1, minTeamSize ?? 1);
  const effectiveMax = Math.max(effectiveMin, maxTeamSize ?? effectiveMin);
  const isFixedSize = effectiveMin === effectiveMax;
  const teamSize = 1 + members.length;

  const effectiveFemaleCount = requiresFemaleMember
    ? Math.max(1, requiredFemaleCount ?? 1)
    : 0;

  const minAdditionalMembers = Math.max(0, effectiveMin - 1);

  function resetAlerts() {
    setSuccessMsg(null);
    setErrorMsg(null);
    setFieldErrors({});
  }

  function resetForm() {
    setStep(1);
    setTeamName("");
    setLeaderName("");
    setLeaderEmail("");
    setLeaderPhone("");
    setLeaderGender("");
    setLeaderRole("");
    setCollege("");
    setMembers(
      Array.from({ length: Math.max(1, minAdditionalMembers) }, () =>
        createEmptyMember()
      )
    );
  }

  React.useEffect(() => {
    setMembers((prev) => {
      const required = Math.max(1, minAdditionalMembers);
      if (prev.length >= required) return prev;
      return [
        ...prev,
        ...Array.from({ length: required - prev.length }, () =>
          createEmptyMember()
        ),
      ];
    });
  }, [minAdditionalMembers]);

  function updateMember(index: number, patch: Partial<TeamMember>) {
    setMembers((prev) =>
      prev.map((member, i) => (i === index ? { ...member, ...patch } : member))
    );
  }

  function addMember() {
    if (teamSize >= effectiveMax) return;
    setMembers((prev) => [...prev, createEmptyMember()]);
  }

  function removeMember(index: number) {
    if (members.length <= Math.max(1, minAdditionalMembers)) return;
    setMembers((prev) => prev.filter((_, i) => i !== index));
  }

  function getFemaleCount() {
    let count = 0;

    if (normalize(leaderGender) === "female") {
      count += 1;
    }

    for (const member of members) {
      if (normalize(member.gender) === "female") {
        count += 1;
      }
    }

    return count;
  }

  function validateStep1() {
    if (!teamName.trim()) return "Team name is required.";
    if (!college.trim()) return "College is required.";
    return null;
  }

  function validateStep2() {
    if (!leaderName.trim()) return "Leader name is required.";
    if (!leaderEmail.trim()) return "Leader email is required.";
    if (!leaderPhone.trim()) return "Leader phone is required.";

    if (requiresFemaleMember && !leaderGender.trim()) {
      return "Leader gender is required for this event.";
    }

    if (roleBasedTeam && !leaderRole.trim()) {
      return "Leader role is required.";
    }

    return null;
  }

  function validateStep3() {
    if (teamSize < effectiveMin) {
      return `Minimum team size is ${effectiveMin}.`;
    }

    if (teamSize > effectiveMax) {
      return `Maximum team size is ${effectiveMax}.`;
    }

    if (isFixedSize && teamSize !== effectiveMin) {
      return `Team size must be exactly ${effectiveMin}.`;
    }

    for (let i = 0; i < members.length; i += 1) {
      const member = members[i];

      if (!member.name.trim()) {
        return `Member ${i + 2} name is required.`;
      }

      if (!member.email.trim()) {
        return `Member ${i + 2} email is required.`;
      }

      if (!member.phone.trim()) {
        return `Member ${i + 2} phone is required.`;
      }

      if (requiresFemaleMember && !member.gender.trim()) {
        return `Member ${i + 2} gender is required for this event.`;
      }

      if (roleBasedTeam && !member.role.trim()) {
        return `Member ${i + 2} role is required.`;
      }
    }

    if (requiresFemaleMember) {
      const femaleCount = getFemaleCount();
      if (femaleCount < effectiveFemaleCount) {
        return `At least ${effectiveFemaleCount} female team member${
          effectiveFemaleCount > 1 ? "s are" : " is"
        } required.`;
      }
    }

    return null;
  }

  function goNext() {
    resetAlerts();

    if (step === 1) {
      const err = validateStep1();
      if (err) {
        setErrorMsg(err);
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      const err = validateStep2();
      if (err) {
        setErrorMsg(err);
        return;
      }
      setStep(3);
      return;
    }

    if (step === 3) {
      const err = validateStep3();
      if (err) {
        setErrorMsg(err);
        return;
      }
      setStep(4);
    }
  }

  function goBack() {
    resetAlerts();
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    resetAlerts();

    const step1Error = validateStep1();
    if (step1Error) {
      setStep(1);
      setErrorMsg(step1Error);
      return;
    }

    const step2Error = validateStep2();
    if (step2Error) {
      setStep(2);
      setErrorMsg(step2Error);
      return;
    }

    const step3Error = validateStep3();
    if (step3Error) {
      setStep(3);
      setErrorMsg(step3Error);
      return;
    }

    const payload = {
      team_name: teamName.trim(),
      leader_name: leaderName.trim(),
      leader_email: leaderEmail.trim(),
      leader_phone: leaderPhone.trim() || undefined,
      leader_gender: leaderGender.trim() || undefined,
      leader_role: leaderRole.trim() || undefined,
      college: college.trim() || undefined,
      members: members.map((member) => ({
        name: member.name.trim(),
        email: member.email.trim() || undefined,
        phone: member.phone.trim() || undefined,
        gender: member.gender.trim() || undefined,
        role: member.role.trim() || undefined,
      })),
      source: "event_page",
    };

    setLoading(true);

    try {
      const res = await fetch(
        `/api/public/events/${encodeURIComponent(slug)}/register-team`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = (await res.json().catch(() => null)) as ApiResp | null;

      if (!res.ok || !data || data.ok === false) {
        if (data && !data.ok && data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        setErrorMsg(getErrMessage(data));
        return;
      }

      setSuccessMsg(
        data.message ||
          "Team registration received. You’ll get a confirmation after verification."
      );

      resetForm();
      setStep(1);
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function renderStep1() {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Team basics
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Start with core team details.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <Input
                label="Team name"
                name="team_name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                disabled={loading}
                aria-invalid={fieldErrors.team_name ? true : undefined}
              />
              {fieldErrors.team_name ? (
                <p className="text-sm text-rose-300">
                  {fieldErrors.team_name}
                </p>
              ) : null}
            </div>

            <div className="space-y-1">
              <Input
                label="College"
                name="college"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                required
                disabled={loading}
                aria-invalid={fieldErrors.college ? true : undefined}
              />
              {fieldErrors.college ? (
                <p className="text-sm text-rose-300">{fieldErrors.college}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-background/40 p-4">
          <h4 className="text-sm font-medium text-foreground">Rules</h4>
          <div className="mt-2 space-y-2 text-sm text-muted-foreground">
            <p>
              Team size:{" "}
              {isFixedSize
                ? `exactly ${effectiveMin}`
                : `${effectiveMin} to ${effectiveMax}`}{" "}
              including the leader.
            </p>
            {requiresFemaleMember ? (
              <p>
                Minimum female members required: {effectiveFemaleCount}.
              </p>
            ) : null}
            {roleBasedTeam ? <p>Every team member must have a role.</p> : null}
          </div>
        </div>
      </div>
    );
  }

  function renderStep2() {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Leader details
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Add the primary team contact.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Input
                  label="Leader name"
                  name="leader_name"
                  autoComplete="name"
                  value={leaderName}
                  onChange={(e) => setLeaderName(e.target.value)}
                  required
                  disabled={loading}
                  aria-invalid={fieldErrors.leader_name ? true : undefined}
                />
                {fieldErrors.leader_name ? (
                  <p className="text-sm text-rose-300">
                    {fieldErrors.leader_name}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1">
                <Input
                  label="Leader email"
                  name="leader_email"
                  type="email"
                  autoComplete="email"
                  value={leaderEmail}
                  onChange={(e) => setLeaderEmail(e.target.value)}
                  required
                  disabled={loading}
                  aria-invalid={fieldErrors.leader_email ? true : undefined}
                />
                {fieldErrors.leader_email ? (
                  <p className="text-sm text-rose-300">
                    {fieldErrors.leader_email}
                  </p>
                ) : null}
              </div>
            </div>

            <div
              className={cn(
                "grid grid-cols-1 gap-4",
                requiresFemaleMember ? "md:grid-cols-2" : "md:grid-cols-1"
              )}
            >
              <div className="space-y-1">
                <Input
                  label="Leader phone"
                  name="leader_phone"
                  autoComplete="tel"
                  value={leaderPhone}
                  onChange={(e) => setLeaderPhone(e.target.value)}
                  required
                  disabled={loading}
                  aria-invalid={fieldErrors.leader_phone ? true : undefined}
                />
                {fieldErrors.leader_phone ? (
                  <p className="text-sm text-rose-300">
                    {fieldErrors.leader_phone}
                  </p>
                ) : null}
              </div>

              {requiresFemaleMember ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Leader gender
                  </label>
                  <select
                    value={leaderGender}
                    onChange={(e) => setLeaderGender(e.target.value)}
                    disabled={loading}
                    aria-invalid={fieldErrors.leader_gender ? true : undefined}
                    className={cn(
                      "w-full rounded-lg border bg-background px-3 py-2 text-sm",
                      "min-h-11 text-foreground outline-none transition",
                      "focus-visible:ring-2 focus-visible:ring-ring",
                      fieldErrors.leader_gender
                        ? "border-rose-400/50"
                        : "border-border"
                    )}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                  {fieldErrors.leader_gender ? (
                    <p className="text-sm text-rose-300">
                      {fieldErrors.leader_gender}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>

            {roleBasedTeam ? (
              <div className="space-y-1">
                <Input
                  label="Leader role"
                  name="leader_role"
                  value={leaderRole}
                  onChange={(e) => setLeaderRole(e.target.value)}
                  required
                  disabled={loading}
                  aria-invalid={fieldErrors.leader_role ? true : undefined}
                />
                {fieldErrors.leader_role ? (
                  <p className="text-sm text-rose-300">
                    {fieldErrors.leader_role}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  function renderStep3() {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Team members
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Current size: {teamSize} / {effectiveMax}
                {isFixedSize
                  ? ` · Exact size required: ${effectiveMin}`
                  : ` · Minimum required: ${effectiveMin}`}
              </p>
              {requiresFemaleMember || roleBasedTeam ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {requiresFemaleMember
                    ? `Female member requirement: at least ${effectiveFemaleCount}. `
                    : ""}
                  {roleBasedTeam ? "Each member must have a role." : ""}
                </p>
              ) : null}
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={addMember}
              disabled={loading || teamSize >= effectiveMax}
              className={cn(
                "border border-white/10 bg-white/5 text-foreground",
                "hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              Add member
            </Button>
          </div>

          <div className="space-y-4">
            {members.map((member, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-background/40 p-4"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      Member {index + 2}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Additional team participant
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeMember(index)}
                    disabled={
                      loading || members.length <= Math.max(1, minAdditionalMembers)
                    }
                    className="rounded-lg border border-rose-400/20 px-3 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-400/10 hover:text-rose-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <Input
                      label="Name"
                      name={`member_name_${index}`}
                      value={member.name}
                      onChange={(e) =>
                        updateMember(index, { name: e.target.value })
                      }
                      required
                      disabled={loading}
                      aria-invalid={
                        fieldErrors[`members.${index}.name`]
                          ? true
                          : undefined
                      }
                    />
                    {fieldErrors[`members.${index}.name`] ? (
                      <p className="text-sm text-rose-300">
                        {fieldErrors[`members.${index}.name`]}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-1">
                    <Input
                      label="Email"
                      name={`member_email_${index}`}
                      type="email"
                      value={member.email}
                      onChange={(e) =>
                        updateMember(index, { email: e.target.value })
                      }
                      disabled={loading}
                      required
                      aria-invalid={
                        fieldErrors[`members.${index}.email`]
                          ? true
                          : undefined
                      }
                    />
                    {fieldErrors[`members.${index}.email`] ? (
                      <p className="text-sm text-rose-300">
                        {fieldErrors[`members.${index}.email`]}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div
                  className={cn(
                    "mt-4 grid grid-cols-1 gap-4",
                    requiresFemaleMember ? "md:grid-cols-2" : "md:grid-cols-1"
                  )}
                >
                  <div className="space-y-1">
                    <Input
                      label="Phone"
                      name={`member_phone_${index}`}
                      value={member.phone}
                      onChange={(e) =>
                        updateMember(index, { phone: e.target.value })
                      }
                      disabled={loading}
                      required
                      aria-invalid={
                        fieldErrors[`members.${index}.phone`]
                          ? true
                          : undefined
                      }
                    />
                    {fieldErrors[`members.${index}.phone`] ? (
                      <p className="text-sm text-rose-300">
                        {fieldErrors[`members.${index}.phone`]}
                      </p>
                    ) : null}
                  </div>

                  {requiresFemaleMember ? (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Gender
                      </label>
                      <select
                        value={member.gender}
                        onChange={(e) =>
                          updateMember(index, { gender: e.target.value })
                        }
                        disabled={loading}
                        aria-invalid={
                          fieldErrors[`members.${index}.gender`]
                            ? true
                            : undefined
                        }
                        className={cn(
                          "w-full rounded-lg border bg-background px-3 py-2 text-sm",
                          "min-h-11 text-foreground outline-none transition",
                          "focus-visible:ring-2 focus-visible:ring-ring",
                          fieldErrors[`members.${index}.gender`]
                            ? "border-rose-400/50"
                            : "border-border"
                        )}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">
                          Prefer not to say
                        </option>
                      </select>
                      {fieldErrors[`members.${index}.gender`] ? (
                        <p className="text-sm text-rose-300">
                          {fieldErrors[`members.${index}.gender`]}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                {roleBasedTeam ? (
                  <div className="mt-4 space-y-1">
                    <Input
                      label="Role"
                      name={`member_role_${index}`}
                      value={member.role}
                      onChange={(e) =>
                        updateMember(index, { role: e.target.value })
                      }
                      required
                      disabled={loading}
                      aria-invalid={
                        fieldErrors[`members.${index}.role`]
                          ? true
                          : undefined
                      }
                    />
                    {fieldErrors[`members.${index}.role`] ? (
                      <p className="text-sm text-rose-300">
                        {fieldErrors[`members.${index}.role`]}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderStep4() {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
          <h3 className="text-sm font-semibold text-foreground">
            Review details
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Check everything before submitting.
          </p>

          <div className="mt-4 space-y-4 text-sm">
            <div className="rounded-xl border border-white/10 bg-background/40 p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Team
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <p className="text-foreground">
                  <span className="text-muted-foreground">Team name:</span>{" "}
                  {teamName}
                </p>
                <p className="text-foreground">
                  <span className="text-muted-foreground">College:</span>{" "}
                  {college}
                </p>
                <p className="text-foreground">
                  <span className="text-muted-foreground">Team size:</span>{" "}
                  {teamSize}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-background/40 p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Leader
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <p className="text-foreground">
                  <span className="text-muted-foreground">Name:</span>{" "}
                  {leaderName}
                </p>
                <p className="text-foreground">
                  <span className="text-muted-foreground">Email:</span>{" "}
                  {leaderEmail}
                </p>
                <p className="text-foreground">
                  <span className="text-muted-foreground">Phone:</span>{" "}
                  {leaderPhone}
                </p>
                {leaderGender ? (
                  <p className="text-foreground">
                    <span className="text-muted-foreground">Gender:</span>{" "}
                    {leaderGender}
                  </p>
                ) : null}
                {roleBasedTeam && leaderRole ? (
                  <p className="text-foreground">
                    <span className="text-muted-foreground">Role:</span>{" "}
                    {leaderRole}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-background/40 p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Members
              </div>
              <div className="space-y-3">
                {members.map((member, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-white/10 px-3 py-3"
                  >
                    <div className="mb-1 text-xs font-medium text-muted-foreground">
                      Member {index + 2}
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      <p className="text-foreground">
                        <span className="text-muted-foreground">Name:</span>{" "}
                        {member.name}
                      </p>
                      <p className="text-foreground">
                        <span className="text-muted-foreground">Email:</span>{" "}
                        {member.email}
                      </p>
                      <p className="text-foreground">
                        <span className="text-muted-foreground">Phone:</span>{" "}
                        {member.phone}
                      </p>
                      {member.gender ? (
                        <p className="text-foreground">
                          <span className="text-muted-foreground">Gender:</span>{" "}
                          {member.gender}
                        </p>
                      ) : null}
                      {roleBasedTeam && member.role ? (
                        <p className="text-foreground">
                          <span className="text-muted-foreground">Role:</span>{" "}
                          {member.role}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {requiresFemaleMember ? (
              <div className="rounded-xl border border-white/10 bg-background/40 p-4 text-foreground">
                <span className="text-muted-foreground">Female count:</span>{" "}
                {getFemaleCount()} / minimum {effectiveFemaleCount}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-background/30 p-4">
        <div className="flex items-center justify-between gap-2">
          {[1, 2, 3, 4].map((item) => {
            const active = step === item;
            const completed = step > item;

            const label =
              item === 1
                ? "Team"
                : item === 2
                ? "Leader"
                : item === 3
                ? "Members"
                : "Review";

            return (
              <p
                key={item}
                className={cn(
                  "flex-1 whitespace-nowrap text-center text-[11px] font-medium",
                  active || completed
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {label}
              </p>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((item) => {
            const active = step === item;
            const completed = step > item;

            return (
              <div
                key={`bar-${item}`}
                className={cn(
                  "h-2 w-full rounded-full transition",
                  active || completed
                    ? "bg-linear-to-r from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))]"
                    : "bg-white/10"
                )}
              />
            );
          })}
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          {isFixedSize
            ? `Step ${step} of 4 · Team size must be exactly ${effectiveMin}.`
            : `Step ${step} of 4 · Allowed team size: ${effectiveMin} to ${effectiveMax}.`}
        </p>
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}

      {(successMsg || errorMsg) && (
        <div aria-live="polite" className="text-sm">
          {successMsg ? (
            <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-emerald-200">
              {successMsg}
            </p>
          ) : (
            <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-rose-200">
              {errorMsg}
            </p>
          )}
        </div>
      )}

      <div className="border-t border-white/10 pt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            We’ll use your details only for this event and confirmations.
          </p>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
            {step > 1 ? (
              <Button
                type="button"
                variant="secondary"
                onClick={goBack}
                disabled={loading}
                className="border border-white/10 bg-white/5 text-foreground hover:bg-white/10"
              >
                Back
              </Button>
            ) : null}

            {step < 4 ? (
              <Button
                type="button"
                onClick={goNext}
                disabled={loading}
                className="bg-linear-to-r from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))] text-white"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                className="bg-linear-to-r from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))] text-white"
              >
                {loading ? "Submitting..." : "Submit team registration"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}