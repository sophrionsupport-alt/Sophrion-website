// src/app/(site)/ticket/[code]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import TicketCard from "@/components/tickets/TicketCard";
import { getTicketByCode } from "@/lib/tickets/getTicketByCode";

export const runtime = "nodejs";

type Props = {
  params: Promise<{
    code: string;
  }>;
};

export default async function TicketPage({ params }: Props) {
  const { code } = await params;
  const data = await getTicketByCode(code);

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(84,92,255,0.12),transparent_20%),radial-gradient(circle_at_right,rgba(45,212,191,0.10),transparent_18%),hsl(222,47%,6%)] px-4 py-10 text-white md:px-6 md:py-14">
      <div className="mx-auto max-w-7xl">
        <Link
          href={data.event.slug ? `/events/${data.event.slug}` : "/events"}
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/65 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to event
        </Link>

        <TicketCard data={data} />
      </div>
    </main>
  );
}