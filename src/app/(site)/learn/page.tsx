import Link from 'next/link';

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-semibold text-stone-900">Learn</h1>
      <p className="mt-3 text-stone-600">(Placeholder) This will later redirect to your LMS when it’s ready.</p>
      <div className="mt-6">
        <Link href="/" className="text-sm font-medium text-stone-900 underline underline-offset-4">
          Back to home
        </Link>
      </div>
    </div>
  );
}