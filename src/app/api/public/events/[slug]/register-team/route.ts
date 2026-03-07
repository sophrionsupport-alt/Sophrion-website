import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type ApiOk<T = unknown> = {
  ok: true;
  data?: T;
  message?: string;
};

type ApiFail = {
  ok: false;
  error: string;
  fieldErrors?: Record<string, string>;
};

type RegistrationType = "individual" | "team" | "both";

function ok<T>(data?: T, message?: string) {
  return NextResponse.json({ ok: true, data, message } satisfies ApiOk<T>);
}

function fail(
  error: string,
  status = 400,
  fieldErrors?: Record<string, string>
) {
  return NextResponse.json(
    { ok: false, error, fieldErrors } satisfies ApiFail,
    { status }
  );
}

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

type TeamMemberInput = {
  name?: string;
  email?: string;
  phone?: string;
  college?: string;
  gender?: string;
  role?: string;
};

type RegisterTeamBody = {
  team_name?: string;
  leader_name?: string;
  leader_email?: string;
  leader_phone?: string;
  leader_gender?: string;
  leader_role?: string;
  college?: string;
  members?: TeamMemberInput[];
};

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizePhone(value: unknown) {
  return typeof value === "string" ? value.replace(/\s+/g, "").trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function dedupeSpaces(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeGender(value: unknown) {
  const v = cleanString(value).toLowerCase();
  if (
    v === "male" ||
    v === "female" ||
    v === "other" ||
    v === "prefer_not_to_say"
  ) {
    return v;
  }
  return "";
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = supabaseAdmin();

    if (!slug?.trim()) {
      return fail("Missing event slug.", 400);
    }

    const body = (await req.json().catch(() => null)) as RegisterTeamBody | null;

    if (!body) {
      return fail("Invalid JSON body.", 400);
    }

    const teamName = dedupeSpaces(cleanString(body.team_name));
    const leaderName = dedupeSpaces(cleanString(body.leader_name));
    const leaderEmail = normalizeEmail(body.leader_email);
    const leaderPhone = normalizePhone(body.leader_phone);
    const leaderGender = normalizeGender(body.leader_gender);
    const leaderRole = dedupeSpaces(cleanString(body.leader_role));
    const college = dedupeSpaces(cleanString(body.college));
    const rawMembers = Array.isArray(body.members) ? body.members : [];

    const members = rawMembers.map((m) => ({
      name: dedupeSpaces(cleanString(m?.name)),
      email: normalizeEmail(m?.email),
      phone: normalizePhone(m?.phone),
      college: dedupeSpaces(cleanString(m?.college || college)),
      gender: normalizeGender(m?.gender),
      role: dedupeSpaces(cleanString(m?.role)),
    }));

    const fieldErrors: Record<string, string> = {};

    if (!teamName) fieldErrors.team_name = "Team name is required.";
    if (!leaderName) fieldErrors.leader_name = "Leader name is required.";

    if (!leaderEmail) fieldErrors.leader_email = "Leader email is required.";
    else if (!isValidEmail(leaderEmail)) {
      fieldErrors.leader_email = "Leader email is invalid.";
    }

    if (!leaderPhone) fieldErrors.leader_phone = "Leader phone is required.";
    if (!college) fieldErrors.college = "College is required.";

    members.forEach((member, index) => {
      const prefix = `members.${index}`;

      if (!member.name) fieldErrors[`${prefix}.name`] = "Member name is required.";

      if (!member.email) fieldErrors[`${prefix}.email`] = "Member email is required.";
      else if (!isValidEmail(member.email)) {
        fieldErrors[`${prefix}.email`] = "Member email is invalid.";
      }

      if (!member.phone) fieldErrors[`${prefix}.phone`] = "Member phone is required.";
    });

    if (Object.keys(fieldErrors).length > 0) {
      return fail("Please fix the highlighted fields.", 400, fieldErrors);
    }

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select(
        `
        id,
        slug,
        title,
        is_published,
        registration_open,
        registration_type,
        min_team_size,
        max_team_size,
        requires_female_member,
        required_female_count,
        role_based_team
        `
      )
      .eq("slug", slug)
      .eq("is_published", true)
      .single<{
        id: string;
        slug: string;
        title: string;
        is_published: boolean;
        registration_open: boolean;
        registration_type: RegistrationType | null;
        min_team_size: number | null;
        max_team_size: number | null;
        requires_female_member: boolean | null;
        required_female_count: number | null;
        role_based_team: boolean | null;
      }>();

    if (eventError || !event) {
      return fail("Event not found.", 404);
    }

    if (!event.registration_open) {
      return fail("Registrations are closed for this event.", 400);
    }

    if (
      event.registration_type !== "team" &&
      event.registration_type !== "both"
    ) {
      return fail("This event does not allow team registrations.", 400);
    }

    const totalTeamSize = 1 + members.length;
    const minTeamSize =
      typeof event.min_team_size === "number" ? event.min_team_size : 1;
    const maxTeamSize =
      typeof event.max_team_size === "number" ? event.max_team_size : minTeamSize;

    if (totalTeamSize < minTeamSize) {
      return fail(
        `Minimum team size is ${minTeamSize}. Your current team size is ${totalTeamSize}.`,
        400
      );
    }

    if (totalTeamSize > maxTeamSize) {
      return fail(
        `Maximum team size is ${maxTeamSize}. Your current team size is ${totalTeamSize}.`,
        400
      );
    }

    if (minTeamSize === maxTeamSize && totalTeamSize !== minTeamSize) {
      return fail(
        `Team size must be exactly ${minTeamSize}. Your current team size is ${totalTeamSize}.`,
        400
      );
    }

    const allEmails = [leaderEmail, ...members.map((m) => m.email)];
    const duplicateEmails = allEmails.filter(
      (email, index) => allEmails.indexOf(email) !== index
    );

    if (duplicateEmails.length > 0) {
      return fail("Duplicate email addresses are not allowed in one team.", 400);
    }

    const allPhones = [leaderPhone, ...members.map((m) => m.phone)].filter(Boolean);
    const duplicatePhones = allPhones.filter(
      (phone, index) => allPhones.indexOf(phone) !== index
    );

    if (duplicatePhones.length > 0) {
      return fail("Duplicate phone numbers are not allowed in one team.", 400);
    }

    if (event.role_based_team) {
      if (!leaderRole) {
        fieldErrors.leader_role = "Leader role is required.";
      }

      members.forEach((member, index) => {
        if (!member.role) {
          fieldErrors[`members.${index}.role`] = "Member role is required.";
        }
      });
    }

    if (event.requires_female_member) {
      if (!leaderGender) {
        fieldErrors.leader_gender = "Leader gender is required for this event.";
      }

      members.forEach((member, index) => {
        if (!member.gender) {
          fieldErrors[`members.${index}.gender`] =
            "Member gender is required for this event.";
        }
      });

      const requiredFemaleCount =
        typeof event.required_female_count === "number" &&
        event.required_female_count > 0
          ? event.required_female_count
          : 1;

      let femaleCount = 0;

      if (leaderGender === "female") {
        femaleCount += 1;
      }

      for (const member of members) {
        if (member.gender === "female") {
          femaleCount += 1;
        }
      }

      if (femaleCount < requiredFemaleCount) {
        fieldErrors.members = `At least ${requiredFemaleCount} female team member${requiredFemaleCount > 1 ? "s are" : " is"} required.`;
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return fail("Please fix the highlighted fields.", 400, fieldErrors);
    }

    const teamInsert = {
      event_id: event.id,
      team_name: teamName,
      leader_name: leaderName,
      leader_email: leaderEmail,
      leader_phone: leaderPhone,
      college,
    };

    const { data: createdTeam, error: teamError } = await supabase
      .from("teams")
      .insert(teamInsert)
      .select("id, event_id, team_name, leader_name, leader_email, created_at")
      .single();

    if (teamError || !createdTeam) {
      console.error("register-team: team insert failed", teamError);
      return fail("Failed to create team registration.", 500);
    }

    const teamMembersInsert = [
      {
        team_id: createdTeam.id,
        member_name: leaderName,
        member_email: leaderEmail,
        member_phone: leaderPhone,
        college,
        gender: leaderGender || null,
        role: leaderRole || null,
        is_leader: true,
      },
      ...members.map((member) => ({
        team_id: createdTeam.id,
        member_name: member.name,
        member_email: member.email,
        member_phone: member.phone,
        college: member.college || college,
        gender: member.gender || null,
        role: member.role || null,
        is_leader: false,
      })),
    ];

    const { error: membersError } = await supabase
      .from("team_members")
      .insert(teamMembersInsert);

    if (membersError) {
      console.error("register-team: team members insert failed", membersError);

      await supabase.from("teams").delete().eq("id", createdTeam.id);

      return fail("Failed to save team members.", 500);
    }

    return ok(
      {
        team: {
          id: createdTeam.id,
          team_name: createdTeam.team_name,
          leader_name: createdTeam.leader_name,
          leader_email: createdTeam.leader_email,
          team_size: totalTeamSize,
        },
        event: {
          id: event.id,
          slug: event.slug,
          title: event.title,
        },
      },
      "Team registration submitted successfully."
    );
  } catch (error) {
    console.error("register-team: unexpected error", error);
    return fail("Internal server error.", 500);
  }
}