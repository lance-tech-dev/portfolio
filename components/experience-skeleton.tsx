export function ExperienceSkeleton() {
  return (
    <section className="space-y-6 font-mono">
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
          02 — EXPERIENCE
        </h2>
        <span className="text-[11px] text-neutral-600">Loading...</span>
      </div>
      <div className="space-y-3.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-5 border border-neutral-900 bg-neutral-950/40 rounded-md animate-pulse"
          />
        ))}
      </div>
    </section>
  );
}
