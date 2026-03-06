import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const sp = await searchParams;

  const next =
    typeof sp.next === "string" && sp.next.trim()
      ? sp.next
      : "/admin";

  return <LoginClient nextPath={next} />;
}