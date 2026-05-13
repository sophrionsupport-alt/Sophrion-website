import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ok, fail } from "@/lib/utils/http";
import { JoinApplicationSchema } from "@/lib/validators/join";
import { sendEmail } from "@/lib/email/send";
import { serverEnv } from "@/lib/env";

export const runtime = "nodejs";

const PATHWAY_LABEL: Record<string, string> = {
  ai_systems: "AI Systems",
  data_intelligence: "Data Intelligence",
  creative_ai: "Creative AI",
  cloud_cyber: "Cloud & Cyber",
  smart_engineering: "Smart Engineering",
  not_sure: "Not sure yet",
};

const YEAR_LABEL: Record<string, string> = {
  "1st": "1st Year",
  "2nd": "2nd Year",
  "3rd": "3rd Year",
  final: "Final Year",
  graduate: "Graduate",
  other: "Other",
};

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const parsed = JoinApplicationSchema.safeParse(raw);
    if (!parsed.success) {
      return fail("Invalid payload", 400, { issues: parsed.error.issues });
    }

    const p = parsed.data;
    if (p.company && p.company.trim().length > 0) {
      return ok({ ok: true, id: "honeypot" });
    }

    const subject = `Join application — ${PATHWAY_LABEL[p.pathway] ?? p.pathway}`;
    const body =
      `Year: ${YEAR_LABEL[p.year] ?? p.year}\n` +
      `College: ${p.college}\n` +
      `Pathway: ${PATHWAY_LABEL[p.pathway] ?? p.pathway}\n` +
      (p.phone ? `Phone: ${p.phone}\n` : "") +
      `\n${p.message}\n`;

    const supabase = createSupabaseAdminClient();
    const { data: row, error } = await supabase
      .from("contact_messages")
      .insert([
        {
          name: p.name,
          email: p.email,
          phone: p.phone ?? null,
          subject,
          message: body,
          source: p.source ?? "join_page",
        },
      ])
      .select("id, created_at")
      .single();

    if (error) {
      return fail(error.message, 500);
    }

    if (serverEnv) {
      try {
        await sendEmail({
          to: serverEnv.CONTACT_INBOX,
          subject: `[Sophrion Join] ${subject} — ${p.name}`,
          html: `<p><strong>New join interest</strong></p>
            <p><strong>Name:</strong> ${escape(p.name)}</p>
            <p><strong>Email:</strong> ${escape(p.email)}</p>
            <p><strong>College:</strong> ${escape(p.college)}</p>
            <p><strong>Year:</strong> ${escape(YEAR_LABEL[p.year] ?? p.year)}</p>
            <p><strong>Pathway:</strong> ${escape(PATHWAY_LABEL[p.pathway] ?? p.pathway)}</p>
            ${p.phone ? `<p><strong>Phone:</strong> ${escape(p.phone)}</p>` : ""}
            <pre style="white-space:pre-wrap">${escape(p.message)}</pre>`,
          text: `${subject}\n\n${body}`,
        });
      } catch (e) {
        console.error("[join] email failed", e);
      }
    }

    return ok({ ok: true, id: row.id });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unexpected error";
    return fail(msg, 500);
  }
}

function escape(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
