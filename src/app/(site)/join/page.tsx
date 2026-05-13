import type { Metadata } from "next";
import JoinMarketing from "@/components/marketing/pages/JoinMarketing";

export const metadata: Metadata = {
  title: "Join Ecosystem",
  description:
    "Apply to join Sophrion’s AI-native execution ecosystem — pathways, squads, production systems, and career acceleration.",
};

export default function Page() {
  return <JoinMarketing />;
}
