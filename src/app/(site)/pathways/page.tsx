import type { Metadata } from "next";
import PathwaysPage from "@/components/marketing/pages/PathwaysPage";

export const metadata: Metadata = {
  title: "Pathways",
  description:
    "Future-ready pathways across AI systems, data intelligence, creative AI, cloud & cyber, and smart engineering — production-oriented learning environments.",
};

export default function Page() {
  return <PathwaysPage />;
}
