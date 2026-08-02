import { portfolioData } from "@/app/data/portfolio-data";
import { TechStackCard } from "@/components/tech-stack-card";

export function BentoGrid() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Capabilities & Expertise
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg">
          A cross-functional approach to software and systems engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(220px,auto)]">
        {portfolioData.bentoItems.map((item, index) => {
          if (item.type === "techstack") {
            return (
              <TechStackCard
                key={index}
                title={item.title}
                icon={item.icon}
                color={item.color}
                categories={item.categories}
              />
            );
          }

          let spanClass = "col-span-1";
          if (item.size === "large") spanClass = "col-span-1 md:col-span-2 lg:col-span-2 row-span-2";
          if (item.size === "medium") spanClass = "col-span-1 md:col-span-2";

          return (
            <div
              key={index}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-500 bento-glow ${spanClass} shadow-sm hover:shadow-xl hover:shadow-emerald-500/5`}
            >
              <div className="z-10 h-full flex flex-col">
                <div className={`inline-flex p-3 rounded-xl border mb-6 w-max transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 ${item.color}`}>
                  <item.icon size={26} strokeWidth={1.5} />
                </div>
                <div className="mt-auto">
                  <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
