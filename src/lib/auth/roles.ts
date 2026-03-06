// src/lib/auth/roles.ts
export const ROLES = ["admin", "college", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export function isRole(v: unknown): v is Role {
  return typeof v === "string" && (ROLES as readonly string[]).includes(v);
}

export function isAdmin(role?: Role | null) {
  return role === "admin";
}

export function canManageEvents(role?: Role | null) {
  return role === "admin" || role === "college";
}