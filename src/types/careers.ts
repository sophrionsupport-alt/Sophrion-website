// src/types/careers.ts

export const CAREER_TEAMS = [
  "Product",
  "Engineering",
  "Design",
  "Growth",
  "Campus Partnerships",
  "Operations",
  "Research",
] as const;

export const CAREER_EMPLOYMENT_TYPES = [
  "Internship",
  "Full-time",
  "Part-time",
  "Contract",
  "Fellowship",
  "Volunteer",
] as const;

export const CAREER_WORK_MODES = [
  "Remote",
  "Hybrid",
  "Onsite",
] as const;

export const CAREER_APPLICATION_STATUSES = [
  "new",
  "reviewing",
  "shortlisted",
  "interviewing",
  "selected",
  "rejected",
] as const;

export type CareerTeam = (typeof CAREER_TEAMS)[number];
export type CareerEmploymentType = (typeof CAREER_EMPLOYMENT_TYPES)[number];
export type CareerWorkMode = (typeof CAREER_WORK_MODES)[number];
export type CareerApplicationStatus = (typeof CAREER_APPLICATION_STATUSES)[number];

export type CareerRole = {
  id: string;
  title: string;
  slug: string;
  team: CareerTeam;
  location: string | null;
  employment_type: CareerEmploymentType;
  mode: CareerWorkMode;
  short_description: string;
  description: string | null;
  responsibilities: string[];
  requirements: string[];
  nice_to_have: string[];
  min_compensation: number | null;
  max_compensation: number | null;
  compensation_currency: string | null;
  is_open: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type CareerApplication = {
  id: string;
  role_id: string | null;
  role_title_snapshot: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  college: string | null;
  degree: string | null;
  graduation_year: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  resume_url: string | null;
  why_join: string | null;
  cover_letter: string | null;
  status: CareerApplicationStatus;
  source: string;
  created_at: string;
  updated_at: string;
};

export type CareerRoleListItem = Pick<
  CareerRole,
  | "id"
  | "title"
  | "slug"
  | "team"
  | "location"
  | "employment_type"
  | "mode"
  | "short_description"
  | "min_compensation"
  | "max_compensation"
  | "compensation_currency"
  | "is_open"
  | "is_published"
  | "sort_order"
  | "created_at"
>;

export type CareerRoleFilters = {
  team?: CareerTeam | "All";
  employment_type?: CareerEmploymentType | "All";
  mode?: CareerWorkMode | "All";
  search?: string;
};

export type CareerRoleFormValues = {
  title: string;
  slug: string;
  team: CareerTeam;
  location: string;
  employment_type: CareerEmploymentType;
  mode: CareerWorkMode;
  short_description: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  nice_to_have: string[];
  min_compensation: number | null;
  max_compensation: number | null;
  compensation_currency: string;
  is_open: boolean;
  is_published: boolean;
  sort_order: number;
};

export type CareerApplyFormValues = {
  role_id?: string | null;
  role_title_snapshot?: string | null;
  full_name: string;
  email: string;
  phone: string;
  college: string;
  degree: string;
  graduation_year: string;
  linkedin_url: string;
  portfolio_url: string;
  why_join: string;
  cover_letter: string;
  source?: string;
};

export type CareerStatusUpdateValues = {
  status: CareerApplicationStatus;
};

export type CareersApiOk<T = unknown> = {
  ok: true;
  data?: T;
  message?: string;
};

export type CareersApiFail = {
  ok: false;
  error?: string;
  message?: string;
};

export type CareersApiResponse<T = unknown> = CareersApiOk<T> | CareersApiFail;