import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";

type Tool = {
  name: string;
  icon: IconType;
};

type Category = {
  name: string;
  icon: LucideIcon;
  color: string;
  tools: Tool[];
};

type TechStackCardProps = {
  title: string;
  icon: LucideIcon;
  color: string;
  categories: Category[];
};

export function TechStackCard({ title, icon: Icon, color, categories }: TechStackCardProps) {
  return (
    <div className="group relative col-span-1 md:col-span-3 lg:col-span-4 row-span-2 flex flex-col overflow-hidden rounded-3xl p-6 sm:p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-500 bento-glow shadow-sm hover:shadow-xl hover:shadow-emerald-500/5">
      <div className="flex items-center gap-4 mb-6 sm:mb-8">
        <div className={`inline-flex p-3 rounded-xl border w-max ${color}`}>
          <Icon size={26} strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          {title}
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((category) => (
          <div
            key={category.name}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 p-3 sm:p-4 space-y-3"
          >
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${category.color}`}>
              <category.icon size={13} strokeWidth={2} />
              {category.name}
            </div>
            <ul className="space-y-2.5">
              {category.tools.map((tool) => (
                <li key={tool.name} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <tool.icon size={15} className="shrink-0 mt-0.5 text-zinc-500 dark:text-zinc-500" />
                  <span className="leading-snug break-words">{tool.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
}
