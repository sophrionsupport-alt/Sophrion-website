"use client";

import Link from "next/link";

type RegistrationType = "individual" | "team" | "both";

type Props = {
  event: {
    slug: string;
    registration_open: boolean;
    registration_type: RegistrationType;
    min_team_size: number | null;
    max_team_size: number | null;
    requires_female_member?: boolean | null;
    required_female_count?: number | null;
    role_based_team?: boolean | null;
  };
};

export default function EventRegistrationSection({ event }: Props) {
  if (!event.registration_open) {
    return (
      <div className="rounded-2xl border border-border bg-background/40 p-4 text-sm text-foreground/70">
        Registrations are currently closed.
      </div>
    );
  }

  const label =
    event.registration_type === "individual"
      ? "Register Individually"
      : event.registration_type === "team"
      ? "Register Team"
      : "Register Now";

  return (
    <Link
      href={`/events/${event.slug}/register`}
      className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-purple-600 to-cyan-500 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
    >
      {label}
    </Link>
  );
}