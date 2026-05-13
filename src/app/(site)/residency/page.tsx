import type { Metadata } from "next";
import ResidencyPage from "@/components/marketing/pages/ResidencyPage";

export const metadata: Metadata = {
  title: "Residency",
  description:
    "Startup simulation and production residency — squads, sprint workflows, mentor architecture, deployable outputs, and career launch systems.",
};

export default function Page() {
  return <ResidencyPage />;
}
