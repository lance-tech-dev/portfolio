import { getPublicProjects } from "@/lib/queries";
import { ProjectsCarousel } from "@/components/projects-carousel";

export async function ProjectsSection() {
  const projects = await getPublicProjects();

  if (projects.length === 0) {
    return (
      <section id="projects" className="space-y-6 font-mono">
        <div className="flex items-center justify-between pb-3">
          <h2 className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
            01 — PROJECTS
          </h2>
        </div>
        <div className="p-8 border border-neutral-800 rounded-2xl bg-neutral-950/40 text-center text-xs text-neutral-500">
          No published projects available yet.
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="space-y-6 font-mono">
      <ProjectsCarousel projects={projects} />
    </section>
  );
}
