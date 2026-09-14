export function StackSkeleton() {
  return (
    <section className="space-y-6 font-mono">
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
          03 — TECH STACK
        </h2>
        <span className="text-[11px] text-neutral-600">Loading...</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-[38px] w-20 border border-neutral-900 bg-neutral-950/40 rounded-md animate-pulse"
          />
        ))}
      </div>
    </section>
  );
}
