import { ArrowUpRight } from "lucide-react";
import { getPublicProjects } from "@/lib/queries";
import { Project } from "@/types/portfolio";

function ProjectRow({ project }: { project: Project }) {
  const href = project.demo_url || project.github_url;

  const content = (
    <>
      <span className="text-base font-bold text-white sm:w-44 shrink-0">
        {project.title}
      </span>
      <div className="flex-1 min-w-0 space-y-1.5">
        {project.tech_stack?.length > 0 && (
          <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
            {project.tech_stack.slice(0, 3).join(" · ")}
          </p>
        )}
        <p className="text-sm text-neutral-400">{project.description}</p>
      </div>
      {href && (
        <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors shrink-0" />
      )}
    </>
  );

  const className =
    "group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 py-5 px-4 -mx-4 rounded-lg border-b border-neutral-900 last:border-b-0 transition-colors";

  if (!href) {
    return <div className={className}>{content}</div>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} hover:bg-neutral-950/60`}
    >
      {content}
    </a>
  );
}

export default async function ProjectsPage() {
  const projects = await getPublicProjects();

  return (
    <section className="space-y-8 font-mono">
      <div className="pb-3 border-b border-neutral-800 space-y-2">
        <h1 className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
          01 — ALL PROJECTS
        </h1>
        <p className="text-sm text-neutral-500 max-w-xl">
          Client platforms, internal tools, and side builds I&apos;ve shipped
          end to end.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="p-8 border border-neutral-800 rounded-2xl bg-neutral-950/40 text-center text-xs text-neutral-500">
          No published projects available yet.
        </div>
      ) : (
        <div>
          {projects.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
