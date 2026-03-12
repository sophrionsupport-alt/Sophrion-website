"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import { toIST } from "@/lib/utils/dates";

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

type ApiResponse = {
  ok: boolean;
  error?: string;
  message?: string;
  data?: {
    result: ScanResult;
    message: string;
    registration?: any;
    ticket?: any;
    event?: any;
    checkedInMeta?: CheckedInMeta | null;
  };
};

type VolunteerSession = {
  id?: string | null;
  full_name?: string | null;
  email?: string | null;
  event_title?: string | null;
};

export default function VolunteerScannerPage() {
  const params = useParams<{ id: string }>();
  const eventId = params?.id ?? "";

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const processingRef = useRef(false);
  const lastTokenRef = useRef<string | null>(null);
  const startTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [result, setResult] = useState<ApiResponse["data"] | null>(null);
  const [scanning, setScanning] = useState(false);
  const [starting, setStarting] = useState(false);
  const [scannerOpened, setScannerOpened] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [volunteer, setVolunteer] = useState<VolunteerSession | null>(null);

  async function stopScanner() {
    if (startTimerRef.current) {
      clearTimeout(startTimerRef.current);
      startTimerRef.current = null;
    }

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

    const scannerEl = document.getElementById("volunteer-scanner");
    if (!scannerEl) {
      setResult({
        result: "invalid",
        message: "Scanner container not ready. Please try again.",
      });
      setStarting(false);
      return;
    }

    setResult(null);
    setStarting(true);
    lastTokenRef.current = null;

    const scanner = new Html5Qrcode("volunteer-scanner");
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10 },
        async (decodedText) => {
          await handleScan(decodedText);
        },
        () => {}
      );

      setScanning(true);
    } catch (error) {
      console.error(error);
      setResult({
        result: "invalid",
        message: "Unable to start camera scanner.",
      });
      await stopScanner();
    } finally {
      setStarting(false);
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
        setResult({
          result: "invalid",
          message: "Missing event id.",
        });
        return;
      }

      const res = await fetch("/api/volunteer/checkin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: cleanToken, eventId }),
      });

      const json: ApiResponse = await res.json();

      setResult(
        json.data ?? {
          result: "invalid",
          message: json.error || "Scan failed.",
        }
      );
    } catch (error) {
      console.error(error);
      setResult({
        result: "invalid",
        message: "Scan failed. Please try again.",
      });
    } finally {
      processingRef.current = false;
    }
  }

  async function handleScanNext() {
    setScannerOpened(true);
    startTimerRef.current = setTimeout(() => {
      void startScanner();
    }, 120);
  }

  async function handleOpenScanner() {
    setScannerOpened(true);
    startTimerRef.current = setTimeout(() => {
      void startScanner();
    }, 120);
  }

  async function handleCloseScanner() {
    await stopScanner();
    setScannerOpened(false);
  }

  async function logout() {
    await fetch("/api/volunteer/logout", { method: "POST" });
    window.location.href = "/volunteer/login";
  }

  useEffect(() => {
    let ignore = false;

    async function loadSession() {
      try {
        setSessionLoading(true);

        const res = await fetch("/api/volunteer/session", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          if (!ignore) setVolunteer(null);
          return;
        }

        const json = await res.json();

        if (!ignore) {
          setVolunteer(json?.data ?? null);
        }
      } catch (error) {
        console.error(error);
        if (!ignore) setVolunteer(null);
      } finally {
        if (!ignore) setSessionLoading(false);
      }
    }

    void loadSession();

    return () => {
      ignore = true;
      if (startTimerRef.current) {
        clearTimeout(startTimerRef.current);
      }
      void stopScanner();
    };
  }, []);

  const personName =
    result?.registration?.registration?.full_name ||
    result?.registration?.team?.team_name ||
    null;

  const checkedInAt = result?.checkedInMeta?.checked_in_at
    ? toIST(result.checkedInMeta.checked_in_at)
    : result?.ticket?.checked_in_at
      ? toIST(result.ticket.checked_in_at)
      : null;

  const checkedInBy =
    result?.checkedInMeta?.checked_in_by_name ||
    result?.checkedInMeta?.checked_in_by_email ||
    result?.checkedInMeta?.checked_in_by ||
    null;

  const resultTone =
    result?.result === "valid"
      ? "border-emerald-500/30 bg-emerald-500/10"
      : result?.result === "already_used"
        ? "border-amber-500/30 bg-amber-500/10"
        : "border-red-500/30 bg-red-500/10";

  return (
    <div className="mx-auto max-w-xl space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Volunteer Scanner</h1>
          <p className="text-sm text-foreground/60">Event check-in console</p>
        </div>

        <button
          onClick={logout}
          className="rounded-xl border border-border px-4 py-2 text-sm"
        >
          Logout
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        {sessionLoading ? (
          <div className="text-sm text-foreground/60">
            Loading volunteer details...
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <div className="text-xs uppercase tracking-wide text-foreground/50">
                Volunteer
              </div>
              <div className="mt-1 text-lg font-medium">
                {volunteer?.full_name || "Volunteer"}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/70 bg-background/40 p-3">
                <div className="text-xs uppercase tracking-wide text-foreground/50">
                  Email
                </div>
                <div className="mt-1 text-sm break-all text-foreground/80">
                  {volunteer?.email || "—"}
                </div>
              </div>

              <div className="rounded-xl border border-border/70 bg-background/40 p-3">
                <div className="text-xs uppercase tracking-wide text-foreground/50">
                  Event
                </div>
                <div className="mt-1 text-sm text-foreground/80">
                  {volunteer?.event_title || "Assigned event"}
                </div>
              </div>
            </div>

            {!scannerOpened && (
              <button
                onClick={handleOpenScanner}
                className="inline-flex rounded-xl bg-foreground px-4 py-2 text-sm text-background"
              >
                Open Scanner
              </button>
            )}
          </div>
        )}
      </div>

      {scannerOpened && (
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="font-medium">Scanner View</div>
              <div className="text-sm text-foreground/60">
                Align QR code inside the frame
              </div>
            </div>

            {!scanning && !starting ? (
              <button
                onClick={handleCloseScanner}
                className="rounded-xl border border-border px-3 py-2 text-sm"
              >
                Close
              </button>
            ) : null}
          </div>

          <div className="scanner-shell">
            <div id="volunteer-scanner" className="min-h-85 w-full" />

            <div className="scanner-grid" />
            <div className="scanner-vignette" />

            <div className="pointer-events-none absolute inset-0 z-10">
              <div className="absolute left-1/2 top-1/2 h-57.5 w-57.5 -translate-x-1/2 -translate-y-1/2">
                <div className="absolute left-0 top-0 h-10 w-10 rounded-tl-2xl border-l-4 border-t-4 border-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.45)]" />
                <div className="absolute right-0 top-0 h-10 w-10 rounded-tr-2xl border-r-4 border-t-4 border-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.45)]" />
                <div className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-2xl border-b-4 border-l-4 border-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.45)]" />
                <div className="absolute bottom-0 right-0 h-10 w-10 rounded-br-2xl border-b-4 border-r-4 border-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.45)]" />

                {scanning && (
                  <div className="absolute inset-x-0 top-0 flex justify-center">
                    <div className="scan-line" />
                  </div>
                )}
              </div>

                <div className="absolute inset-x-0 top-3 text-center text-xs font-medium tracking-[0.2em] text-cyan-300/80">
                  ALIGN QR WITH FRAME
                </div>
</div>
          </div>

          {starting && (
            <div className="mt-3 text-sm text-foreground/60">
              Starting scanner...
            </div>
          )}

          {!scanning && !starting && result && (
            <div className="mt-4">
              <button
                onClick={handleScanNext}
                className="rounded-xl bg-foreground px-4 py-2 text-sm text-background"
              >
                Scan Next Ticket
              </button>
            </div>
          )}
        </div>
      )}

      {result && (
        <div className={`rounded-2xl border p-4 ${resultTone}`}>
          <div className="font-semibold">{result.message}</div>

          {personName && (
            <div className="mt-2 text-sm text-foreground/80">{personName}</div>
          )}

          {result.ticket?.ticket_code && (
            <div className="mt-1 text-xs text-foreground/60">
              Ticket: {result.ticket.ticket_code}
            </div>
          )}

          {checkedInAt && (
            <div className="mt-3 space-y-1 text-sm text-foreground/80">
              <div>Checked in at: {checkedInAt}</div>
              {checkedInBy && <div>Checked in by: {checkedInBy}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}