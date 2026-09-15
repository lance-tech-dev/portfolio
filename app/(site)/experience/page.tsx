import { MapPin, CornerDownRight } from "lucide-react";
import { getExperiences } from "@/lib/queries";

const formatMonthYear = (date?: string | null) => {
  if (!date) return "";
  const [year, month] = date.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

const formatDuration = (start: string, end?: string | null) => {
  const [sy, sm] = start.split("-").map(Number);
  const endSource = end ? end : new Date().toISOString().slice(0, 10);
  const [ey, em] = endSource.split("-").map(Number);

  const totalMonths = Math.max((ey - sy) * 12 + (em - sm) + 1, 1);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} mo${months > 1 ? "s" : ""}`);
  return parts.join(" ") || "1 mo";
};

const getInitials = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

export default async function ExperiencePage() {
  const experiences = await getExperiences();

  return (
    <section className="space-y-8 font-mono">
      <div className="pb-3 border-b border-neutral-800 space-y-2">
        <h1 className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
          02 — FULL EXPERIENCE HISTORY
        </h1>
        <p className="text-sm text-neutral-500 max-w-xl">
          Roles I&apos;ve held across technical support and full-stack
          development, and where I was based for each one.
        </p>
      </div>

      {experiences.length === 0 ? (
        <div className="p-8 border border-neutral-800 rounded-2xl bg-neutral-950/40 text-center text-xs text-neutral-500">
          No experience listed yet.
        </div>
      ) : (
        <div>
          {experiences.map((exp, index) => (
            <div key={exp.id} className="relative flex gap-4 pb-8 last:pb-0">
              {/* Avatar + connecting line */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900 flex items-center justify-center text-[11px] font-bold text-neutral-300 shrink-0">
                  {getInitials(exp.company_name)}
                </div>
                {index < experiences.length - 1 && (
                  <div className="w-px flex-1 bg-neutral-800 mt-2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1.5 space-y-2.5">
                <div>
                  <h2 className="text-sm font-bold text-white">
                    {exp.company_name}
                  </h2>
                  <p className="text-xs text-neutral-500">
                    {exp.employment_type}
                  </p>
                </div>

                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-sm font-semibold text-neutral-200">
                    {exp.role}
                  </h3>
                  <span className="text-[11px] text-neutral-500 whitespace-nowrap">
                    {formatMonthYear(exp.start_date)} —{" "}
                    {exp.is_current ? "Present" : formatMonthYear(exp.end_date)}
                    {" · "}
                    {formatDuration(exp.start_date, exp.end_date)}
                  </span>
                </div>

                <p className="flex items-center gap-1.5 text-xs text-neutral-500 flex-wrap">
                  <MapPin className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                  <span>{exp.company_location}</span>
                  <span className="text-neutral-700">·</span>
                  <span>{exp.setup}</span>
                </p>

                {exp.sub_company_name && (
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 pl-3 border-l border-neutral-800 flex-wrap">
                    <CornerDownRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                    <span className="text-neutral-300">
                      {exp.sub_company_name}
                    </span>
                    {exp.sub_company_location && (
                      <>
                        <MapPin className="w-3 h-3 text-neutral-600 shrink-0 ml-1" />
                        <span>{exp.sub_company_location}</span>
                      </>
                    )}
                  </div>
                )}

                <p className="text-sm text-neutral-400 leading-relaxed max-w-2xl whitespace-pre-line">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
