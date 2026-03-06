// src/app/sitemap.ts

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://sophrion.in";

  const staticRoutes = [
    "",
    "/students",
    "/colleges",
    "/about",
    "/contact",
    "/blog",
    "/events",
    "/privacy",
  ];

  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}