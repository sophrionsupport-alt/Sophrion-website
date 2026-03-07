// src/components/careers/WhyJoin.tsx
const items = [
  {
    title: "Mission-first work",
    description:
      "Work on systems that directly improve student outcomes, institutional readiness, and real-world opportunity access.",
  },
  {
    title: "Real ownership",
    description:
      "You will not be stuck doing shallow support work. You will shape actual product, growth, and operational decisions.",
  },
  {
    title: "Build with speed",
    description:
      "We move fast, iterate quickly, and value people who can think clearly and execute without waiting around.",
  },
  {
    title: "Meaningful systems",
    description:
      "Sophrion is not chasing vanity features. We are building infrastructure for the future of education and outcomes.",
  },
];

export default function WhyJoin() {
  return (
    <section className="mx-auto max-w-6xl">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300/80">
          Why Sophrion
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Join a team building systems that matter
        </h2>
        <p className="mt-4 text-base leading-7 text-white/65">
          Early-stage means the work is intense, the learning is real, and the
          impact is visible. This is for people who want to build, not coast.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-white/65">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}