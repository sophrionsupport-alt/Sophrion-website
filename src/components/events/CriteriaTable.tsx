"use client";

type Item = {
  criteria: string;
  weight: string;
};

export default function CriteriaTable({ items }: { items: Item[] }) {
  if (!items?.length) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <tbody>
          {items.map((row, i) => (
            <tr key={i} className="border-b border-white/10 last:border-none">
              <td className="px-4 py-3">{row.criteria}</td>
              <td className="w-24 px-4 py-3 text-right text-foreground/70">
                {row.weight}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}