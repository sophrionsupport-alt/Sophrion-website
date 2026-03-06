export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFD")                 // remove accents
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")     // remove special chars
    .replace(/\s+/g, "-")             // spaces -> dash
    .replace(/-+/g, "-")              // collapse dashes
    .replace(/^-|-$/g, "");           // trim dashes
}