// src/app/(admin)/admin/careers/new/page.tsx
import Link from "next/link";
import CareerRoleForm from "@/components/forms/CareerRoleForm";

export const metadata = {
  title: "New Career Role",
};

export default function AdminCareerNewPage() {
  return (
    <main className="space-y-6">
      <div>
        <Link
          href="/admin/careers"
          className="inline-flex items-center text-sm text-white/65 transition hover:text-white"
        >
          ← Back to careers
        </Link>
      </div>

      <CareerRoleForm mode="create" />
    </main>
  );
}