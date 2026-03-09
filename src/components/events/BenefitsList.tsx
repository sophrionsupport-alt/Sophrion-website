export default function BenefitsList({ items }: { items?: string[] | null }) {
  if (!items?.length) return null;

  return (
    <ul className="space-y-2 text-sm text-foreground/75">
      {items.map((b, i) => (
        <li key={i}>• {b}</li>
      ))}
    </ul>
  );
}