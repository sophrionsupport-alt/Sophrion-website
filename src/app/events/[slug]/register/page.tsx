import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import EventTeamRegisterForm from "@/components/forms/EventTeamRegisterForm";
import EventIndividualRegisterForm from "@/components/forms/EventIndividualRegisterForm";

type RegistrationType = "individual" | "team" | "both";

function RegistrationTypeTabs({
  slug,
  active,
}: {
  slug: string;
  active: "individual" | "team";
}) {
  return (
    <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
      <Link
        href={`/events/${slug}/register?mode=individual`}
        className={`rounded-lg px-4 py-2 text-sm transition ${
          active === "individual"
            ? "bg-white text-black"
            : "text-foreground/75 hover:text-foreground"
        }`}
      >
        Individual
      </Link>
      <Link
        href={`/events/${slug}/register?mode=team`}
        className={`rounded-lg px-4 py-2 text-sm transition ${
          active === "team"
            ? "bg-white text-black"
            : "text-foreground/75 hover:text-foreground"
        }`}
      >
        Team
      </Link>
    </div>
  );
}

export default async function EventRegisterPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ mode?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const mode = resolvedSearchParams.mode;

  const supabase = await createSupabaseServerClient();

  const { data: event, error } = await supabase
    .from("events")
    .select(
      `
      id,
      slug,
      title,
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
      registration_open: boolean;
      registration_type: RegistrationType | null;
      min_team_size: number | null;
      max_team_size: number | null;
      requires_female_member: boolean | null;
      required_female_count: number | null;
      role_based_team: boolean | null;
    }>();

  if (error || !event) return notFound();

  if (!event.registration_open) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Link
          href={`/events/${slug}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to event
        </Link>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <h1 className="text-2xl font-semibold text-foreground">
            Registration Closed
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Registration is currently not open for this event.
          </p>
        </div>
      </div>
    );
  }

  const registrationType = event.registration_type ?? "individual";

  let activeMode: "individual" | "team" = "individual";

  if (registrationType === "team") {
    activeMode = "team";
  } else if (registrationType === "both") {
    activeMode = mode === "team" ? "team" : "individual";
  }

  if (registrationType === "individual" && mode === "team") {
    activeMode = "individual";
  }

  if (registrationType === "team" && mode === "individual") {
    activeMode = "team";
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href={`/events/${slug}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to event
      </Link>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
        <p className="text-sm text-muted-foreground">Event Registration</p>
        <h1 className="mt-2 text-3xl font-semibold text-foreground">
          {event.title}
        </h1>

        {registrationType === "individual" ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Complete the individual registration form below.
          </p>
        ) : registrationType === "team" ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Complete the team registration form below.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              This event supports both individual and team registrations.
              Choose your registration mode below.
            </p>
            <RegistrationTypeTabs slug={event.slug} active={activeMode} />
          </div>
        )}

        <div className="mt-8">
          {activeMode === "individual" ? (
            <EventIndividualRegisterForm slug={event.slug} eventId={event.id} />
          ) : (
            <EventTeamRegisterForm
              slug={event.slug}
              minTeamSize={event.min_team_size}
              maxTeamSize={event.max_team_size}
              requiresFemaleMember={Boolean(event.requires_female_member)}
              requiredFemaleCount={event.required_female_count}
              roleBasedTeam={Boolean(event.role_based_team)}
            />
          )}
        </div>
      </div>
    </div>
  );
}