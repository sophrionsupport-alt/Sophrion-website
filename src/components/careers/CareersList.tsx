// src/components/careers/CareersList.tsx
import type { CareerRoleListItem } from "@/types/careers";
import CareerFilters from "@/components/careers/CareerFilters";

export default function CareersList({
  roles,
}: {
  roles: CareerRoleListItem[];
}) {
  return (
    <section id="open-roles" className="mx-auto max-w-6xl scroll-mt-24">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300/80">
          Open roles
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Work on systems with real-world impact
        </h2>
        <p className="mt-4 text-base leading-7 text-white/65">
          Explore current openings across product, engineering, growth,
          partnerships, and operations.
        </p>
      </div>

      <div className="mt-10">
        <CareerFilters roles={roles} />
      </div>
    </section>
  );
}