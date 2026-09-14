import Link from "next/link";
import { getExperiences } from "@/lib/queries";

const PREVIEW_COUNT = 4;

const startYear = (date: string) => new Date(date).getFullYear();

export async function ExperienceSection() {
  const allExperiences = await getExperiences();
  const experiences = allExperiences.slice(0, PREVIEW_COUNT);

  return (
    <section id="experience" className="space-y-6 font-mono">
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
          02 — EXPERIENCE
        </h2>
        <Link
          href="/experience"
          className="text-[10px] text-neutral-500 hover:text-white uppercase tracking-wider font-semibold transition-colors"
        >
          FULL HISTORY →
        </Link>
      </div>

      {experiences.length === 0 ? (
        <div className="p-8 border border-neutral-800 rounded-2xl bg-neutral-950/40 text-center text-xs text-neutral-500">
          No experience listed yet.
        </div>
      ) : (
        <div>
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="flex items-center justify-between gap-4 py-3.5 text-sm border-b border-neutral-900 last:border-b-0"
            >
              <span className="w-12 shrink-0 text-neutral-500 text-xs">
                {startYear(exp.start_date)}
              </span>
              <span className="flex-1 min-w-0 font-bold text-white truncate">
                {exp.role}
              </span>
              <span className="text-xs text-neutral-500 text-right shrink-0">
                {exp.company_name}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
