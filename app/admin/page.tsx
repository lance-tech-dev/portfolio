"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Project, TechCategory, TechStack } from "@/types/portfolio";
import { ProjectModal } from "@/components/admin/project-modal";
import { TechStackCategory } from "@/components/admin/tech-stack-category";
import {
  FolderGit2,
  Briefcase,
  Layers,
  Award,
  LogOut,
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
} from "lucide-react";

type TabType = "projects" | "experience" | "stack" | "certifications";

const CATEGORIES: TechCategory[] = [
  "Frontend",
  "Backend",
  "DevOps & Cloud",
  "AI & Machine Learning",
  "Security & Identity",
  "CMS & No-Code",
  "Developer Tools",
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [stacks, setStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const router = useRouter();

  const fetchProjects = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setProjects(data as Project[]);
    setLoading(false);
  };

  const fetchStacks = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("tech_stacks")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setStacks(data as TechStack[]);
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === "projects") fetchProjects();
    if (activeTab === "stack") fetchStacks();
  }, [activeTab]);

  const handleAddStack = async (name: string, category: TechCategory) => {
    const { data, error } = await supabase
      .from("tech_stacks")
      .insert([{ name, category }])
      .select()
      .single();

    if (error) {
      alert(`Error saving stack item: ${error.message}`);
      return;
    }

    if (data) {
      setStacks((prev) => [...prev, data as TechStack]);
    }
  };

  const handleDeleteStack = async (id: string) => {
    const { error } = await supabase.from("tech_stacks").delete().eq("id", id);
    if (!error) {
      setStacks((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) fetchProjects();
  };

  const handleTogglePublish = async (project: Project) => {
    const newStatus = !(project.is_published ?? true);

    const { error } = await supabase
      .from("projects")
      .update({ is_published: newStatus })
      .eq("id", project.id);

    if (!error) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, is_published: newStatus } : p
        )
      );
    }
  };

  const handleOpenAddProject = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (project: Project) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const tabs = [
    { id: "projects", label: "01 — Projects", icon: FolderGit2 },
    { id: "experience", label: "02 — Experience", icon: Briefcase },
    { id: "stack", label: "03 — Stack", icon: Layers },
    { id: "certifications", label: "04 — Certifications", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <header className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/50">
        <div>
          <h1 className="text-base font-bold tracking-wide">
            Portfolio Admin
          </h1>
          <p className="text-xs text-neutral-400">
            Content Management Dashboard
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-1.5 text-xs bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white rounded transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <div className="flex border-b border-neutral-800 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-3 text-xs border-b-2 transition-all shrink-0 ${
                  isActive
                    ? "border-white text-white font-semibold bg-neutral-900/40"
                    : "border-transparent text-neutral-400 hover:text-white hover:border-neutral-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between pt-2">
            <div>
              <h2 className="text-sm font-semibold capitalize text-neutral-300">
                Manage {activeTab}
              </h2>
              {activeTab === "stack" && (
                <p className="text-xs text-neutral-500 mt-0.5">
                  Select technologies you work with, grouped by category.
                </p>
              )}
            </div>
            {activeTab === "projects" && (
              <button
                onClick={handleOpenAddProject}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white text-black font-semibold rounded hover:bg-neutral-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            )}
          </div>

          {/* Cleaned Projects List */}
          {activeTab === "projects" && (
            <div>
              {loading ? (
                <div className="text-xs text-neutral-500 py-12 text-center">
                  Loading projects...
                </div>
              ) : projects.length === 0 ? (
                <div className="p-8 border border-neutral-800 rounded-lg bg-neutral-950/40 text-center space-y-3">
                  <p className="text-sm text-neutral-300 font-medium">
                    No projects found
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {projects.map((project) => {
                    const isLive = project.is_published !== false;
                    return (
                      <div
                        key={project.id}
                        className="flex items-center justify-between gap-4 px-5 py-4 border border-neutral-800/90 bg-neutral-950/60 rounded-lg hover:border-neutral-700 transition-colors"
                      >
                        {/* Left Metadata: Title + Slug */}
                        <div className="space-y-1 min-w-0">
                          <h3 className="text-sm font-bold text-white truncate tracking-wide">
                            {project.title}
                          </h3>
                          <p className="text-[11px] text-neutral-500 font-mono truncate">
                            /{project.slug}
                          </p>
                        </div>

                        {/* Right Actions: Status Badge + Controls */}
                        <div className="flex items-center gap-4 shrink-0">
                          {/* Interactive Status Pill */}
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(project)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border transition-all ${
                              isLive
                                ? "bg-emerald-950/50 border-emerald-800/80 text-emerald-400 hover:bg-emerald-900/40"
                                : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300"
                            }`}
                            title="Click to toggle Public / Draft status"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isLive ? "bg-emerald-400 animate-pulse" : "bg-neutral-500"
                              }`}
                            />
                            <span>{isLive ? "Public" : "Draft"}</span>
                          </button>

                          <div className="h-4 w-[1px] bg-neutral-800" />

                          {/* Action Controls */}
                          <div className="flex items-center gap-1">
                            {project.demo_url && (
                              <a
                                href={project.demo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-900 transition-colors"
                                title="View Demo"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              onClick={() => handleOpenEditProject(project)}
                              className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-900 transition-colors"
                              title="Edit Project"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="p-1.5 text-neutral-500 hover:text-red-400 rounded hover:bg-neutral-900 transition-colors"
                              title="Delete Project"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Stack View */}
          {activeTab === "stack" && (
            <div className="space-y-6">
              {loading ? (
                <div className="text-xs text-neutral-500 py-12 text-center">
                  Loading tech stack...
                </div>
              ) : (
                CATEGORIES.map((cat) => (
                  <TechStackCategory
                    key={cat}
                    category={cat}
                    selectedItems={stacks}
                    onToggle={handleAddStack}
                    onRemove={handleDeleteStack}
                  />
                ))
              )}
            </div>
          )}

          {/* Placeholders */}
          {activeTab !== "projects" && activeTab !== "stack" && (
            <div className="p-8 border border-neutral-800 rounded-lg bg-neutral-950/40 text-center text-xs text-neutral-500">
              Panel for {activeTab} will be connected in the next step.
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSuccess={fetchProjects}
        projectToEdit={editingProject}
      />
    </div>
  );
}