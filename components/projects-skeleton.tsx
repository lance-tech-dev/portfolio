export function ProjectsSkeleton() {
  return (
    <section className="space-y-6 font-mono">
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
          01 — PROJECTS
        </h2>
        <span className="text-[11px] text-neutral-600">Loading...</span>
      </div>
      <div className="h-80 border border-neutral-900 bg-neutral-950/40 rounded-3xl animate-pulse max-w-sm mx-auto" />
    </section>
  );
}
