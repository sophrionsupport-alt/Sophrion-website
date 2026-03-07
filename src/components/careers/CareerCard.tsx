// src/components/careers/CareerCard.tsx
import Link from "next/link";
import type { CareerRoleListItem } from "@/types/careers";

function formatCompensation(role: CareerRoleListItem) {
  const currency = role.compensation_currency || "INR";
  if (role.min_compensation == null && role.max_compensation == null) {
    return null;
  }

  if (
    role.min_compensation != null &&
    role.max_compensation != null &&
    role.min_compensation !== role.max_compensation
  ) {
    return `${currency} ${role.min_compensation.toLocaleString()} - ${role.max_compensation.toLocaleString()}`;
  }

  const value = role.max_compensation ?? role.min_compensation;
  return value != null ? `${currency} ${value.toLocaleString()}` : null;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/4 px-3 py-1 text-xs text-white/70">
      {children}
    </span>
  );
}

export default function CareerCard({ role }: { role: CareerRoleListItem }) {
  const compensation = formatCompensation(role);

  return (
    <article className="group rounded-[1.6rem] border border-white/10 bg-white/3 p-6 transition hover:border-cyan-400/20 hover:bg-white/4.5">
      <div className="flex flex-wrap gap-2">
        <Badge>{role.team}</Badge>
        <Badge>{role.employment_type}</Badge>
        <Badge>{role.mode}</Badge>
        {role.location ? <Badge>{role.location}</Badge> : null}
      </div>

      <div className="mt-5">
        <h3 className="text-xl font-semibold tracking-tight text-white">
          {role.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-white/65">
          {role.short_description}
        </p>
      </div>

      {compensation ? (
        <div className="mt-5 text-sm font-medium text-cyan-300/85">
          {compensation}
        </div>
      ) : null}

      <div className="mt-6 flex items-center justify-between gap-3">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
            role.is_open
              ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
              : "border border-white/10 bg-white/4 text-white/55"
          }`}
        >
          {role.is_open ? "Open" : "Closed"}
        </span>

        <Link
          href={`/careers/${role.slug}`}
          className="inline-flex items-center justify-center rounded-xl border border-white/12 bg-white/4 px-4 py-2 text-sm font-medium text-white/85 transition group-hover:border-cyan-400/20 group-hover:bg-white/[0.07]"
        >
          View role
        </Link>
      </div>
    </article>
  );
}