import type { Metadata } from "next";
import EcosystemPage from "@/components/marketing/pages/EcosystemPage";

export const metadata: Metadata = {
  title: "Ecosystem",
  description:
    "A structured career acceleration ecosystem for the AI era — foundation, pathways, qualification, residency, career launch, and fellowship tracks.",
};

export default function Page() {
  return <EcosystemPage />;
}
