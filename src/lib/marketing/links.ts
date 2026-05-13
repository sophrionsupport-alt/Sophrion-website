/** Public marketing routes — keep nav/footer/CTAs in sync with the site IA. */
export const MARKETING = {
  home: "/",
  about: "/about",
  ecosystem: "/ecosystem",
  pathways: "/pathways",
  residency: "/residency",
  institutions: "/institutions",
  join: "/join",
  contact: "/contact",
  privacy: "/privacy",
  blog: "/blog",
} as const;

export const PATHWAY_ANCHORS = {
  ai: "/pathways#pathway-ai-systems",
  data: "/pathways#pathway-data-intelligence",
  creative: "/pathways#pathway-creative-ai",
  cloud: "/pathways#pathway-cloud-cyber",
  engineering: "/pathways#pathway-smart-engineering",
} as const;
