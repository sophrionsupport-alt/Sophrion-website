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

export default function VolunteerScannerPage() {
  const params = useParams<{ id: string }>();
  const eventId = params?.id ?? "";

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const processingRef = useRef(false);
  const lastTokenRef = useRef<string | null>(null);

  const [result, setResult] = useState<ApiResponse["data"] | null>(null);
  const [scanning, setScanning] = useState(false);
  const [starting, setStarting] = useState(false);

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

    setResult(null);
    setStarting(true);
    lastTokenRef.current = null;

    const scanner = new Html5Qrcode("volunteer-scanner");
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
    await startScanner();
  }

  async function logout() {
    await fetch("/api/volunteer/logout", { method: "POST" });
    window.location.href = "/volunteer/login";
  }

  useEffect(() => {
    if (!eventId) return;

    void startScanner();

    return () => {
      void stopScanner();
    };
  }, [eventId]);

  const personName =
    result?.registration?.registration?.full_name ||
    result?.registration?.team?.team_name ||
    null;

  const checkedInAt = result?.checkedInMeta?.checked_in_at
    ? toIST(result.checkedInMeta.checked_in_at)
    : null;

  const checkedInBy =
    result?.checkedInMeta?.checked_in_by_name ||
    result?.checkedInMeta?.checked_in_by_email ||
    result?.checkedInMeta?.checked_in_by ||
    null;

  const showScanNextButton = !scanning && !starting;

  return (
    <div className="mx-auto max-w-xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Volunteer Scanner</h1>
          <p className="text-sm text-foreground/60">Event check-in</p>
        </div>

        <button
          onClick={logout}
          className="rounded-xl border border-border px-4 py-2 text-sm"
        >
          Logout
        </button>
      </div>

      <div
        id="volunteer-scanner"
        className="overflow-hidden rounded-2xl border border-border"
      />

      {starting && (
        <div className="text-sm text-foreground/60">Starting scanner...</div>
      )}

      {!scanning && !starting && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="text-sm text-foreground/70">
            Scanner is paused. Review the result, then continue when ready.
          </div>

          {showScanNextButton && (
            <button
              onClick={handleScanNext}
              className="shrink-0 rounded-xl border border-border bg-foreground px-4 py-2 text-sm text-background"
            >
              Scan Next Ticket
            </button>
          )}
        </div>
      )}

      {result && (
        <div
          className={`rounded-2xl border p-4 ${
            result.result === "valid"
              ? "border-emerald-500/30 bg-emerald-500/10"
              : result.result === "already_used"
              ? "border-amber-500/30 bg-amber-500/10"
              : "border-red-500/30 bg-red-500/10"
          }`}
        >
          <div className="font-semibold">{result.message}</div>

          {personName && (
            <div className="mt-2 text-sm text-foreground/80">{personName}</div>
          )}

          {result.ticket?.ticket_code && (
            <div className="mt-1 text-xs text-foreground/60">
              Ticket: {result.ticket.ticket_code}
            </div>
          )}

          {result.result === "already_used" && (
            <div className="mt-3 space-y-1 text-sm text-foreground/80">
              {checkedInAt && <div>Checked in at: {checkedInAt}</div>}
              {checkedInBy && <div>Checked in by: {checkedInBy}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}