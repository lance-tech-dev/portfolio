import { getTechStacks } from "@/lib/queries";
import { TechStack } from "@/types/portfolio";
import { TECH_CATEGORIES } from "@/lib/constants/tech-presets";

export default async function StackPage() {
  const stacks = await getTechStacks();

  const grouped = stacks.reduce<Record<string, TechStack[]>>((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categories = TECH_CATEGORIES.filter((cat) => grouped[cat]?.length);

  return (
    <section className="space-y-8 font-mono">
      <div className="pb-3 border-b border-neutral-800 space-y-2">
        <h1 className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
          03 — TECH STACK
        </h1>
        <p className="text-sm text-neutral-500 max-w-xl">
          Tools and platforms I reach for day to day, grouped by where they
          fit in the stack.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="p-8 border border-neutral-800 rounded-2xl bg-neutral-950/40 text-center text-xs text-neutral-500">
          No stack items listed yet.
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category} className="space-y-3">
              <h2 className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">
                {category}
              </h2>
              <div className="flex flex-wrap gap-2">
                {grouped[category].map((item) => (
                  <span
                    key={item.id}
                    className="px-3.5 py-2 rounded-md border border-neutral-800 text-sm text-neutral-300"
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
