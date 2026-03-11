"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import { toIST, relativeTime } from "@/lib/utils/dates";

type ScanResult =
  | "valid"
  | "already_used"
  | "cancelled"
  | "invalid"
  | "signature_failed"
  | "wrong_event";

type CheckedInMeta = {
  checked_in_at?: string | null;
  checked_in_by?: string | null;
  checked_in_by_name?: string | null;
  checked_in_by_email?: string | null;
};

type ScanResponse = {
  ok: boolean;
  error?: string;
  message?: string;
  data?: {
    ok: boolean;
    result: ScanResult;
    message: string;
    registration?: any;
    ticket?: any;
    event?: any;
    checkedInMeta?: CheckedInMeta | null;
  };
};

type DashboardResponse = {
  event: {
    id: string;
    title: string;
    slug: string;
    start_at?: string | null;
    end_at?: string | null;
    is_published?: boolean;
    registration_open?: boolean;
  } | null;
  metrics: {
    issuedTickets: number;
    checkedInTickets: number;
    activeVolunteers: number;
    scansLastHour: number;
  };
  recentScans: Array<{
    id: string;
    created_at: string;
    scan_result: string;
    source?: string | null;
    ticket_id?: string | null;
    scanned_by?: string | null;
    payload?: Record<string, unknown> | null;
    ticket?: {
      id: string;
      ticket_code?: string | null;
      checked_in_at?: string | null;
    } | null;
    volunteer?: {
      id: string;
      full_name?: string | null;
      email?: string | null;
    } | null;
  }>;
};

function badgeClass(result?: string) {
  switch (result) {
    case "valid":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "already_used":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "wrong_event":
      return "border-orange-500/30 bg-orange-500/10 text-orange-300";
    case "cancelled":
    case "invalid":
    case "signature_failed":
    default:
      return "border-red-500/30 bg-red-500/10 text-red-300";
  }
}

export default function AdminEventScannerPage() {
  const params = useParams<{ id: string }>();
  const eventId = params?.id ?? "";
  const router = useRouter();

  const scannerRef = React.useRef<Html5Qrcode | null>(null);
  const processingRef = React.useRef(false);
  const lastTokenRef = React.useRef<string | null>(null);

  const [starting, setStarting] = React.useState(false);
  const [scanning, setScanning] = React.useState(false);
  const [loadingBoard, setLoadingBoard] = React.useState(true);

  const [scanResult, setScanResult] = React.useState<ScanResponse["data"] | null>(
    null
  );
  const [board, setBoard] = React.useState<DashboardResponse | null>(null);

  async function stopScanner() {
    const scanner = scannerRef.current;
    if (!scanner) return;

    try {
      await scanner.stop();
    } catch {}

    try {
      await scanner.clear();
    } catch {}

    scannerRef.current = null;
    setScanning(false);
    setStarting(false);
  }

  async function startScanner() {
    if (!eventId) return;
    if (processingRef.current) return;
    if (scannerRef.current) return;

    setScanResult(null);
    setStarting(true);
    lastTokenRef.current = null;

    const scanner = new Html5Qrcode("admin-event-scanner");
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 260 },
        async (decodedText) => {
          await handleScan(decodedText);
        },
        () => {}
      );

      setScanning(true);
    } catch (error) {
      console.error(error);
      setScanResult({
        ok: false,
        result: "invalid",
        message: "Unable to start camera scanner.",
      });
      await stopScanner();
    } finally {
      setStarting(false);
    }
  }

  async function loadDashboard() {
    if (!eventId) return;

    try {
      setLoadingBoard(true);

      const [eventRes, scansRes, volunteersRes] = await Promise.all([
        fetch(`/api/admin/events/${encodeURIComponent(eventId)}`, {
          cache: "no-store",
        }),
        fetch(`/api/admin/events/${encodeURIComponent(eventId)}/scans`, {
          cache: "no-store",
        }).catch(() => null),
        fetch(`/api/admin/events/${encodeURIComponent(eventId)}/volunteers`, {
          cache: "no-store",
        }).catch(() => null),
      ]);

      const eventJson = await eventRes.json().catch(() => null);
      const scansJson = scansRes ? await scansRes.json().catch(() => null) : null;
      const volunteersJson = volunteersRes
        ? await volunteersRes.json().catch(() => null)
        : null;

      const event = eventJson?.ok
        ? {
            id: eventJson.data.id,
            title: eventJson.data.title,
            slug: eventJson.data.slug,
            start_at: eventJson.data.start_at,
            end_at: eventJson.data.end_at,
            is_published: eventJson.data.is_published,
            registration_open: eventJson.data.registration_open,
          }
        : null;

      const recentScans = Array.isArray(scansJson?.data?.rows)
        ? scansJson.data.rows
        : [];

      const volunteers = Array.isArray(volunteersJson?.data?.rows)
        ? volunteersJson.data.rows
        : [];

      const issuedTicketIds = new Set<string>();
      let checkedInTickets = 0;
      let scansLastHour = 0;

      const now = Date.now();
      for (const row of recentScans) {
        if (row?.ticket_id) issuedTicketIds.add(String(row.ticket_id));
        if (row?.scan_result === "valid") checkedInTickets += 1;

        const created = row?.created_at ? new Date(row.created_at).getTime() : NaN;
        if (!Number.isNaN(created) && now - created <= 60 * 60 * 1000) {
          scansLastHour += 1;
        }
      }

      const activeVolunteers = volunteers.filter(
        (v: any) => v?.is_active && v?.can_scan
      ).length;

      setBoard({
        event,
        metrics: {
          issuedTickets: issuedTicketIds.size,
          checkedInTickets,
          activeVolunteers,
          scansLastHour,
        },
        recentScans,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingBoard(false);
    }
  }

  async function handleScan(token: string) {
    const cleanToken = token.trim();

    if (!cleanToken) return;
    if (processingRef.current) return;
    if (lastTokenRef.current === cleanToken) return;

    processingRef.current = true;
    lastTokenRef.current = cleanToken;

    try {
      await stopScanner();

      if (!eventId) {
        setScanResult({
          ok: false,
          result: "invalid",
          message: "Missing event id.",
        });
        return;
      }

      const res = await fetch("/api/admin/check-in", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token: cleanToken,
          eventId,
          source: "admin-scanner",
          device: "admin-scanner-ui",
        }),
      });

      const json: ScanResponse = await res.json();

      setScanResult(
        json.data ?? {
          ok: false,
          result: "invalid",
          message: json.error || "Scan failed.",
        }
      );

      await loadDashboard();
    } catch (error) {
      console.error(error);
      setScanResult({
        ok: false,
        result: "invalid",
        message: "Scan failed. Please try again.",
      });
    } finally {
      processingRef.current = false;
    }
  }

  async function handleScanNext() {
    await startScanner();
  }

  React.useEffect(() => {
    if (!eventId) return;

    void loadDashboard();
    void startScanner();

    const interval = window.setInterval(() => {
      void loadDashboard();
    }, 15000);

    return () => {
      window.clearInterval(interval);
      void stopScanner();
    };
  }, [eventId]);

  const personName =
    scanResult?.registration?.registration?.full_name ||
    scanResult?.registration?.team?.team_name ||
    null;

  const checkedInAt = toIST(scanResult?.checkedInMeta?.checked_in_at);
  const checkedInBy =
    scanResult?.checkedInMeta?.checked_in_by_name ||
    scanResult?.checkedInMeta?.checked_in_by_email ||
    scanResult?.checkedInMeta?.checked_in_by ||
    null;

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">
            Event Scanner Dashboard
          </h1>
          <p className="text-sm text-foreground/60">
            Scan tickets, review check-in results, and monitor live entry activity.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-xl border border-border bg-background/40 px-4 py-2 text-xs hover:bg-background/60"
            onClick={() => router.push(`/admin/events/${encodeURIComponent(eventId)}`)}
          >
            Back to Event
          </button>

          <button
            className="rounded-xl border border-border bg-background/40 px-4 py-2 text-xs hover:bg-background/60"
            onClick={() =>
              router.push(`/admin/events/${encodeURIComponent(eventId)}/volunteers`)
            }
          >
            Manage Volunteers
          </button>

          <button
            className="rounded-xl border border-border bg-background/40 px-4 py-2 text-xs hover:bg-background/60"
            onClick={() => void loadDashboard()}
          >
            Refresh
          </button>
        </div>
      </div>

      {board?.event && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {board.event.title}
              </h2>
              <p className="text-sm text-foreground/60">{board.event.slug}</p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-border px-3 py-1">
                {board.event.is_published ? "Published" : "Draft"}
              </span>
              <span className="rounded-full border border-border px-3 py-1">
                {board.event.registration_open ? "Registration Open" : "Registration Closed"}
              </span>
              {board.event.start_at && (
                <span className="rounded-full border border-border px-3 py-1">
                  Starts: {toIST(board.event.start_at)}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-xs text-foreground/60">Issued Tickets</div>
          <div className="mt-2 text-3xl font-semibold text-foreground">
            {loadingBoard ? "—" : board?.metrics.issuedTickets ?? 0}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-xs text-foreground/60">Checked In</div>
          <div className="mt-2 text-3xl font-semibold text-foreground">
            {loadingBoard ? "—" : board?.metrics.checkedInTickets ?? 0}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-xs text-foreground/60">Active Volunteers</div>
          <div className="mt-2 text-3xl font-semibold text-foreground">
            {loadingBoard ? "—" : board?.metrics.activeVolunteers ?? 0}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-xs text-foreground/60">Scans Last Hour</div>
          <div className="mt-2 text-3xl font-semibold text-foreground">
            {loadingBoard ? "—" : board?.metrics.scansLastHour ?? 0}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Scanner</h2>
              <p className="text-sm text-foreground/60">
                Use camera to validate and check in attendees.
              </p>
            </div>

            {!scanning && !starting && (
              <button
                onClick={() => void handleScanNext()}
                className="rounded-xl border border-border bg-foreground px-4 py-2 text-sm text-background"
              >
                Scan Next Ticket
              </button>
            )}
          </div>

          <div
            id="admin-event-scanner"
            className="overflow-hidden rounded-2xl border border-border"
          />

          {starting && (
            <div className="text-sm text-foreground/60">Starting scanner...</div>
          )}

          {!scanning && !starting && (
            <div className="rounded-2xl border border-border bg-background/30 p-4 text-sm text-foreground/70">
              Scanner is paused. Review the result, then click{" "}
              <span className="font-medium">Scan Next Ticket</span>.
            </div>
          )}

          {scanResult && (
            <div
              className={`rounded-2xl border p-4 ${badgeClass(scanResult.result)}`}
            >
              <div className="font-semibold">{scanResult.message}</div>

              {personName && (
                <div className="mt-2 text-sm text-foreground/85">{personName}</div>
              )}

              {scanResult.ticket?.ticket_code && (
                <div className="mt-1 text-xs text-foreground/65">
                  Ticket: {scanResult.ticket.ticket_code}
                </div>
              )}

              {scanResult.result === "already_used" && (
                <div className="mt-3 space-y-1 text-sm text-foreground/85">
                  {checkedInAt && <div>Checked in at: {checkedInAt}</div>}
                  {checkedInBy && <div>Checked in by: {checkedInBy}</div>}
                </div>
              )}

              {scanResult.result === "valid" && scanResult.checkedInMeta?.checked_in_at && (
                <div className="mt-3 space-y-1 text-sm text-foreground/85">
                  <div>Checked in at: {toIST(scanResult.checkedInMeta.checked_in_at)}</div>
                  {scanResult.checkedInMeta.checked_in_by_name && (
                    <div>Checked in by: {scanResult.checkedInMeta.checked_in_by_name}</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Live Scan Feed</h2>
              <p className="text-sm text-foreground/60">
                Recent activity across this event.
              </p>
            </div>

            <span className="text-xs text-foreground/50">Auto refresh: 15s</span>
          </div>

          <div className="space-y-3">
            {loadingBoard ? (
              <div className="text-sm text-foreground/60">Loading live feed...</div>
            ) : !board?.recentScans?.length ? (
              <div className="text-sm text-foreground/60">
                No scan activity yet for this event.
              </div>
            ) : (
              board.recentScans.map((row) => {
                const byName =
                  row.volunteer?.full_name ||
                  row.volunteer?.email ||
                  row.scanned_by ||
                  "Unknown";

                return (
                  <div
                    key={row.id}
                    className="rounded-xl border border-border bg-background/25 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${badgeClass(
                              row.scan_result
                            )}`}
                          >
                            {row.scan_result}
                          </span>

                          {row.ticket?.ticket_code && (
                            <span className="text-xs text-foreground/70">
                              {row.ticket.ticket_code}
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-foreground/80">
                          By: {byName}
                        </div>

                        <div className="text-xs text-foreground/55">
                          {toIST(row.created_at)} • {relativeTime(row.created_at)}
                        </div>
                      </div>

                      <div className="text-right text-xs text-foreground/55">
                        {row.source || "scanner"}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}