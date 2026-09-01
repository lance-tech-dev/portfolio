import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import { ToolChipGroup } from "@/components/tool-chip";

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
    <div className="group relative col-span-1 md:col-span-3 lg:col-span-4 flex flex-col overflow-hidden rounded-3xl p-6 sm:p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-500 bento-glow shadow-sm hover:shadow-xl hover:shadow-emerald-500/5">
      <div className="flex items-center gap-4 mb-6 sm:mb-8">
        <div className={`inline-flex p-3 rounded-xl border w-max ${color}`}>
          <Icon size={26} strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          {title}
        </h3>
      </div>

      <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {categories.map((category) => (
          <div
            key={category.name}
            className="flex flex-col sm:flex-row sm:items-center gap-3 py-4 first:pt-0 last:pb-0"
          >
            <div className="flex items-center gap-2 sm:w-40 shrink-0">
              <div className={`inline-flex p-1.5 rounded-lg border ${category.color}`}>
                <category.icon size={13} strokeWidth={2} />
              </div>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {category.name}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <ToolChipGroup
                tools={category.tools.map((tool) => ({
                  name: tool.name,
                  icon: <tool.icon size={17} />,
                }))}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
}
