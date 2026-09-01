import { portfolioData } from "@/app/data/portfolio-data";

export function ExperienceTimeline() {
  return (
    <section className="mt-32 space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Experience & Journey
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg">
          My professional background in engineering and support.
        </p>
      </div>

      {portfolioData.experience.length > 0 && (
        <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-3 md:ml-4 space-y-12 pb-8">
          {portfolioData.experience.map((exp) => (
            <div key={`${exp.company}-${exp.role}`} className="relative pl-8 md:pl-12 group">
              <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800 ring-4 ring-zinc-50 dark:ring-zinc-950 group-hover:bg-emerald-500 group-hover:ring-emerald-500/20 transition-all duration-300" />

              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2 gap-2 sm:gap-0">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {exp.role}
                </h3>
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full w-max">
                  {exp.date}
                </span>
              </div>

              <h4 className="text-zinc-900 dark:text-zinc-300 font-medium mb-3">
                {exp.company}
              </h4>

              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
