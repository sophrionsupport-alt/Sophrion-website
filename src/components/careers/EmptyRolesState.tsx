// src/components/careers/EmptyRolesState.tsx
import Link from "next/link";

export default function EmptyRolesState() {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-white/12 bg-white/2 px-6 py-12 text-center">
      <h3 className="text-2xl font-semibold text-white">
        No open roles right now
      </h3>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/65">
        We may not have a live role that matches your profile today, but we are
        always interested in meeting strong builders who align with Sophrion’s
        mission.
      </p>

      <div className="mt-7">
        <Link
          href="/careers/apply"
          className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white"
        >
          Join builder network
        </Link>
      </div>
    </div>
  );
}