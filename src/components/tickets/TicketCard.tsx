// src/components/tickets/TicketCard.tsx

import Link from "next/link";
import TicketQRCode from "@/components/tickets/TicketQRCode";
import TicketMetaBlock from "@/components/tickets/TicketMetaBlock";
import TicketStatusBadge from "@/components/tickets/TicketStatusBadge";
import type { PublicTicketData, TicketStatus } from "@/lib/tickets/types";

type Props = {
  data: PublicTicketData;
};

function fmtDateTime(value?: string | null) {
  if (!value) return "To be announced";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "To be announced";
  return date.toLocaleString();
}

function fmtMoney(value?: string | number | null) {
  if (value === null || value === undefined || value === "") return "—";
  return `₹${value}`;
}

function labelEventType(value?: string | null) {
  switch (value) {
    case "workshop":
      return "Workshop";
    case "hackathon":
      return "Hackathon";
    case "hybrid":
      return "Hybrid";
    default:
      return value || "Event";
  }
}

function labelRegistrationType(value?: string | null) {
  switch (value) {
    case "individual":
      return "Individual";
    case "team":
      return "Team";
    case "both":
      return "Individual + Team";
    default:
      return value || "Registration";
  }
}

export default async function TicketCard({ data }: Props) {
  const { ticket, event, registration } = data;

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] shadow-[0_0_80px_rgba(94,106,210,0.12)] backdrop-blur">
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(120,119,198,0.25),transparent_35%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_35%)] p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.24em] text-cyan-300/80">
              Sophrion Entry Ticket
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              {event.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <TicketStatusBadge status={ticket.status as TicketStatus} />
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                {labelEventType(event.event_type)}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                {labelRegistrationType(event.registration_type)}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.2em] text-white/45">
              Ticket Code
            </div>
            <div className="mt-2 font-mono text-sm text-cyan-200">
              {ticket.ticket_code}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-white">
              Participant Details
            </h2>

            {registration.kind === "individual" ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <TicketMetaBlock label="Full Name" value={registration.name} />
                <TicketMetaBlock label="Email" value={registration.email} />
                <TicketMetaBlock label="Phone" value={registration.phone} />
                <TicketMetaBlock label="College" value={registration.college} />
                <TicketMetaBlock label="Year" value={registration.year} />
                <TicketMetaBlock
                  label="Roll Number"
                  value={registration.roll_number}
                />
              </div>
            ) : (
              <div className="mt-4 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TicketMetaBlock
                    label="Team Name"
                    value={registration.team_name}
                  />
                  <TicketMetaBlock
                    label="Team Status"
                    value={registration.status}
                  />
                  <TicketMetaBlock
                    label="Leader Name"
                    value={registration.leader?.name}
                  />
                  <TicketMetaBlock
                    label="Leader Email"
                    value={registration.leader?.email}
                  />
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                    Team Members
                  </div>

                  <div className="mt-4 space-y-3">
                    {registration.members.length ? (
                      registration.members.map((member, index) => (
                        <div
                          key={member.id || `${member.name}-${index}`}
                          className="rounded-2xl border border-white/10 bg-black/10 p-4"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <div className="font-medium text-white">
                                {member.name}
                              </div>
                              <div className="mt-1 text-sm text-white/65">
                                {member.email || "No email"}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {member.is_leader && (
                                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-300">
                                  Leader
                                </span>
                              )}
                              {member.role && (
                                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70">
                                  {member.role}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="mt-3 grid gap-3 sm:grid-cols-3">
                            <TicketMetaBlock label="Phone" value={member.phone} />
                            <TicketMetaBlock
                              label="College"
                              value={member.college}
                            />
                            <TicketMetaBlock
                              label="Gender"
                              value={member.gender}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-white/60">
                        No team members found.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">Event Details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <TicketMetaBlock
                label="Start"
                value={fmtDateTime(event.start_date)}
              />
              <TicketMetaBlock label="End" value={fmtDateTime(event.end_date)} />
              <TicketMetaBlock
                label="Reporting Time"
                value={fmtDateTime(event.reporting_time)}
              />
              <TicketMetaBlock label="Location" value={event.location} />
              <TicketMetaBlock label="Venue" value={event.venue_name} />
              <TicketMetaBlock label="Mode" value={event.mode} />
              <TicketMetaBlock label="Fee" value={fmtMoney(event.fee)} />
              <TicketMetaBlock
                label="Prize Pool"
                value={fmtMoney(event.prize_pool)}
              />
              <TicketMetaBlock
                label="Winner Prize"
                value={fmtMoney(event.winner_prize)}
              />
              <TicketMetaBlock
                label="Runner Prize"
                value={fmtMoney(event.runner_prize)}
              />
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">
              Entry Instructions
            </h2>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-white/75">
              {event.entry_instructions?.trim()
                ? event.entry_instructions
                : "Please arrive before the reporting time and carry this QR ticket for verification at entry."}
            </div>

            {(event.contact_person_name ||
              event.contact_person_email ||
              event.contact_person_phone ||
              event.map_url) && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <TicketMetaBlock
                  label="Contact Person"
                  value={event.contact_person_name}
                />
                <TicketMetaBlock
                  label="Contact Email"
                  value={event.contact_person_email}
                />
                <TicketMetaBlock
                  label="Contact Phone"
                  value={event.contact_person_phone}
                />
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                    Venue Map
                  </div>
                  <div className="mt-2 text-sm text-white/90">
                    {event.map_url ? (
                      <Link
                        href={event.map_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-300 transition hover:text-cyan-200"
                      >
                        Open Map
                      </Link>
                    ) : (
                      "—"
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-5">
          <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
            <div className="mb-4 text-sm font-medium text-white">
              Scan at the venue
            </div>

            <div className="flex justify-center">
              <TicketQRCode value={ticket.verification_token} />
            </div>

            <p className="mt-4 text-center text-sm leading-6 text-white/60">
              Present this QR at entry. Once successfully scanned, the ticket
              will be marked as checked in and cannot be reused.
            </p>
          </div>

          <div className="grid gap-4">
            <TicketMetaBlock label="Ticket Status" value={ticket.status} />
            <TicketMetaBlock
              label="Issued At"
              value={fmtDateTime(ticket.issued_at)}
            />
            <TicketMetaBlock
              label="Checked In At"
              value={fmtDateTime(ticket.checked_in_at)}
            />
            <TicketMetaBlock
              label="Ticket Code"
              value={ticket.ticket_code}
              mono
            />
          </div>
        </div>
      </div>
    </div>
  );
}