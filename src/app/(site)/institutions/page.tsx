import type { Metadata } from "next";
import InstitutionsPage from "@/components/marketing/pages/InstitutionsPage";

export const metadata: Metadata = {
  title: "Institutions",
  description:
    "Future-ready innovation ecosystems for colleges and universities — pilots, AI readiness, portfolio visibility, and structured partnership models.",
};

export default function Page() {
  return <InstitutionsPage />;
}
