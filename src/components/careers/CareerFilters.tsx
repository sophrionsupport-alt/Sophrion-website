// src/components/careers/CareerFilters.tsx
"use client";

import * as React from "react";
import {
  CAREER_EMPLOYMENT_TYPES,
  CAREER_TEAMS,
  CAREER_WORK_MODES,
  type CareerRoleListItem,
} from "@/types/careers";
import CareerCard from "@/components/careers/CareerCard";
import EmptyRolesState from "@/components/careers/EmptyRolesState";

type Props = {
  roles: CareerRoleListItem[];
};

export default function CareerFilters({ roles }: Props) {
  const [team, setTeam] = React.useState<string>("All");
  const [employmentType, setEmploymentType] = React.useState<string>("All");
  const [mode, setMode] = React.useState<string>("All");
  const [search, setSearch] = React.useState("");

  const filteredRoles = React.useMemo(() => {
    const q = search.trim().toLowerCase();

    return roles.filter((role) => {
      const matchesTeam = team === "All" || role.team === team;
      const matchesEmploymentType =
        employmentType === "All" || role.employment_type === employmentType;
      const matchesMode = mode === "All" || role.mode === mode;

      const haystack = [
        role.title,
        role.team,
        role.location ?? "",
        role.short_description,
        role.employment_type,
        role.mode,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !q || haystack.includes(q);

      return (
        matchesTeam &&
        matchesEmploymentType &&
        matchesMode &&
        matchesSearch
      );
    });
  }, [roles, team, employmentType, mode, search]);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-white/3 p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roles, teams, keywords..."
            className="h-11 rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-400/30"
          />

          <select
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none focus:border-cyan-400/30"
          >
            <option value="All">All teams</option>
            {CAREER_TEAMS.map((item) => (
              <option key={item} value={item} className="bg-slate-950">
                {item}
              </option>
            ))}
          </select>

          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none focus:border-cyan-400/30"
          >
            <option value="All">All types</option>
            {CAREER_EMPLOYMENT_TYPES.map((item) => (
              <option key={item} value={item} className="bg-slate-950">
                {item}
              </option>
            ))}
          </select>

          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none focus:border-cyan-400/30"
          >
            <option value="All">All modes</option>
            {CAREER_WORK_MODES.map((item) => (
              <option key={item} value={item} className="bg-slate-950">
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredRoles.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredRoles.map((role) => (
            <CareerCard key={role.id} role={role} />
          ))}
        </div>
      ) : (
        <EmptyRolesState />
      )}
    </div>
  );
}