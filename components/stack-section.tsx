import Link from "next/link";
import { getTechStacks } from "@/lib/queries";

const PREVIEW_COUNT = 12;

export async function StackSection() {
  const stacks = await getTechStacks();
  const preview = stacks.slice(0, PREVIEW_COUNT);
  const remaining = stacks.length - preview.length;

  return (
    <section id="stack" className="space-y-6 font-mono">
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
          03 — TECH STACK
        </h2>
        <Link
          href="/stack"
          className="text-[10px] text-neutral-500 hover:text-white uppercase tracking-wider font-semibold transition-colors"
        >
          VIEW ALL →
        </Link>
      </div>

      {preview.length === 0 ? (
        <div className="p-8 border border-neutral-800 rounded-2xl bg-neutral-950/40 text-center text-xs text-neutral-500">
          No stack items listed yet.
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {preview.map((item) => (
            <span
              key={item.id}
              className="px-3.5 py-2 rounded-md border border-neutral-800 text-sm text-neutral-300"
            >
              {item.name}
            </span>
          ))}
          {remaining > 0 && (
            <Link
              href="/stack"
              className="px-3.5 py-2 rounded-md border border-dashed border-neutral-700 text-sm text-neutral-500 hover:text-white hover:border-neutral-500 transition-colors"
            >
              + more
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
