"use client";

type Item = {
  time: string;
  title: string;
};

export default function ScheduleTable({ items }: { items: Item[] }) {
  if (!items?.length) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <tbody>
          {items.map((row, i) => (
            <tr key={i} className="border-b border-white/10 last:border-none">
              <td className="w-32 px-4 py-3 text-foreground/60">{row.time}</td>
              <td className="px-4 py-3 text-foreground">{row.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}