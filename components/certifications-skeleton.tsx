export function CertificationsSkeleton() {
  return (
    <section className="space-y-6 font-mono">
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
          04 — CERTIFICATIONS
        </h2>
        <span className="text-[11px] text-neutral-600">Loading...</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-[132px] border border-neutral-900 bg-neutral-950/40 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    </section>
  );
}
