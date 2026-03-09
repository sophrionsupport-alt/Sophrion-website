export default function PrizeBlock({
  first,
  second,
  third,
}: {
  first?: number | null;
  second?: number | null;
  third?: number | null;
}) {
  if (!first && !second && !third) return null;

  return (
    <div className="space-y-2 text-sm">
      {first && <div>🥇 Winner — ₹{first.toLocaleString()}</div>}
      {second && <div>🥈 Runner-up — ₹{second.toLocaleString()}</div>}
      {third && <div>🥉 Third — ₹{third.toLocaleString()}</div>}
    </div>
  );
}