// src/components/tickets/TicketMetaBlock.tsx

type Props = {
  label: string;
  value?: string | number | null;
  mono?: boolean;
};

export default function TicketMetaBlock({ label, value, mono = false }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-white/45">
        {label}
      </div>
      <div
        className={`mt-2 text-sm text-white/90 ${
          mono ? "font-mono break-all" : ""
        }`}
      >
        {value !== null && value !== undefined && value !== ""
          ? String(value)
          : "—"}
      </div>
    </div>
  );
}