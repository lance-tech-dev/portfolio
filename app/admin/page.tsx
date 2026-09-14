"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import {
  Certification,
  Experience,
  Project,
  TechCategory,
  TechStack,
} from "@/types/portfolio";
import { TechStackCategory } from "@/components/admin/tech-stack-category";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { TECH_CATEGORIES } from "@/lib/constants/tech-presets";

const ProjectModal = dynamic(
  () => import("@/components/admin/project-modal").then((m) => m.ProjectModal),
  { ssr: false }
);
const ExperienceModal = dynamic(
  () =>
    import("@/components/admin/experience-modal").then(
      (m) => m.ExperienceModal
    ),
  { ssr: false }
);
const CertificationModal = dynamic(
  () =>
    import("@/components/admin/certification-modal").then(
      (m) => m.CertificationModal
    ),
  { ssr: false }
);
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
  MapPin,
  Building2,
  CornerDownRight,
} from "lucide-react";

const formatMonthYear = (date?: string | null) => {
  if (!date) return "";
  const [year, month] = date.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

type TabType = "projects" | "experience" | "stack" | "certifications";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [stacks, setStacks] = useState<TechStack[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  );
  const [isCertificationModalOpen, setIsCertificationModalOpen] =
    useState(false);
  const [editingCertification, setEditingCertification] =
    useState<Certification | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{
    type: "project" | "experience" | "certification";
    id: string;
    label: string;
  } | null>(null);
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
    const { data, error } = await supabase
      .from("tech_stacks")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      alert(`Error loading tech stack: ${error.message}`);
    } else if (data) {
      setStacks(data as TechStack[]);
    }
    setLoading(false);
  };

  const fetchExperiences = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .order("is_current", { ascending: false })
      .order("start_date", { ascending: false });
    if (error) {
      alert(`Error loading experience: ${error.message}`);
    } else if (data) {
      setExperiences(data as Experience[]);
    }
    setLoading(false);
  };

  const fetchCertifications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("display_order", { ascending: true })
      .order("issue_date", { ascending: false });
    if (error) {
      alert(`Error loading certifications: ${error.message}`);
    } else if (data) {
      setCertifications(data as Certification[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === "projects") fetchProjects();
    if (activeTab === "stack") fetchStacks();
    if (activeTab === "experience") fetchExperiences();
    if (activeTab === "certifications") fetchCertifications();
  }, [activeTab]);

  const handleAddStack = async (name: string, category: TechCategory) => {
    const { data, error } = await supabase
      .from("tech_stacks")
      .insert([{ name, category }])
      .select()
      .single();

    if (error) {
      const message =
        error.code === "23505"
          ? `"${name}" is already in your stack.`
          : `Error saving stack item: ${error.message}`;
      alert(message);
      return;
    }

    if (data) {
      setStacks((prev) => [...prev, data as TechStack]);
    }
  };

  const handleDeleteStack = async (id: string) => {
    const { error } = await supabase.from("tech_stacks").delete().eq("id", id);
    if (error) {
      alert(`Error removing stack item: ${error.message}`);
      return;
    }
    setStacks((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDeleteProject = (project: Project) => {
    setPendingDelete({
      type: "project",
      id: project.id,
      label: project.title,
    });
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

  const handleDeleteExperience = (experience: Experience) => {
    setPendingDelete({
      type: "experience",
      id: experience.id,
      label: `${experience.role} at ${experience.company_name}`,
    });
  };

  const handleOpenAddExperience = () => {
    setEditingExperience(null);
    setIsExperienceModalOpen(true);
  };

  const handleOpenEditExperience = (experience: Experience) => {
    setEditingExperience(experience);
    setIsExperienceModalOpen(true);
  };

  const handleDeleteCertification = (certification: Certification) => {
    setPendingDelete({
      type: "certification",
      id: certification.id,
      label: certification.name,
    });
  };

  const confirmPendingDelete = async () => {
    if (!pendingDelete) return;
    const { type, id } = pendingDelete;
    setPendingDelete(null);

    const table =
      type === "project"
        ? "projects"
        : type === "experience"
        ? "experience"
        : "certifications";

    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      alert(`Error deleting: ${error.message}`);
      return;
    }

    if (type === "project") fetchProjects();
    if (type === "experience") fetchExperiences();
    if (type === "certification") fetchCertifications();
  };

  const handleToggleCertificationPublish = async (
    certification: Certification
  ) => {
    const newStatus = !certification.is_published;

    const { error } = await supabase
      .from("certifications")
      .update({ is_published: newStatus })
      .eq("id", certification.id);

    if (!error) {
      setCertifications((prev) =>
        prev.map((c) =>
          c.id === certification.id ? { ...c, is_published: newStatus } : c
        )
      );
    }
  };

  const handleOpenAddCertification = () => {
    setEditingCertification(null);
    setIsCertificationModalOpen(true);
  };

  const handleOpenEditCertification = (certification: Certification) => {
    setEditingCertification(certification);
    setIsCertificationModalOpen(true);
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
      <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between px-6 py-4 border-b border-neutral-800 bg-black/90 backdrop-blur-md">
        <div>
          <h1 className="text-base font-bold tracking-wide">
            Portfolio Admin
          </h1>
          <p className="text-xs text-neutral-400">
            Content Management Dashboard
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-1.5 text-xs bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
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
            {activeTab === "experience" && (
              <button
                onClick={handleOpenAddExperience}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white text-black font-semibold rounded hover:bg-neutral-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Experience</span>
              </button>
            )}
            {activeTab === "certifications" && (
              <button
                onClick={handleOpenAddCertification}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white text-black font-semibold rounded hover:bg-neutral-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Certification</span>
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
                                ? "bg-[var(--foreground)]/10 border-[var(--foreground)]/30 text-[var(--foreground)] hover:bg-[var(--foreground)]/15"
                                : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300"
                            }`}
                            title="Click to toggle Public / Draft status"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isLive ? "bg-[var(--foreground)] animate-pulse" : "bg-neutral-500"
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
                              onClick={() => handleDeleteProject(project)}
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

          {/* Experience List */}
          {activeTab === "experience" && (
            <div>
              {loading ? (
                <div className="text-xs text-neutral-500 py-12 text-center">
                  Loading experience...
                </div>
              ) : experiences.length === 0 ? (
                <div className="p-8 border border-neutral-800 rounded-lg bg-neutral-950/40 text-center space-y-3">
                  <p className="text-sm text-neutral-300 font-medium">
                    No experience entries found
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="flex items-start justify-between gap-4 px-5 py-4 border border-neutral-800/90 bg-neutral-950/60 rounded-lg hover:border-neutral-700 transition-colors"
                    >
                      {/* Left: Role + Company + Dates + Description */}
                      <div className="space-y-2 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-white tracking-wide">
                            {exp.role}
                          </h3>
                          {exp.is_current && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border bg-[var(--foreground)]/10 border-[var(--foreground)]/30 text-[var(--foreground)]">
                              <span className="w-1 h-1 rounded-full bg-[var(--foreground)] animate-pulse" />
                              Current
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium border border-neutral-800 text-neutral-400">
                            {exp.employment_type}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium border border-neutral-800 text-neutral-400">
                            {exp.setup}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                          <Building2 className="w-3 h-3 text-neutral-500 shrink-0" />
                          <span>{exp.company_name}</span>
                          <MapPin className="w-3 h-3 text-neutral-600 shrink-0 ml-1.5" />
                          <span className="text-neutral-500">
                            {exp.company_location}
                          </span>
                        </div>

                        {exp.sub_company_name && (
                          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 pl-4 border-l border-neutral-800 ml-1">
                            <CornerDownRight className="w-3 h-3 text-neutral-600 shrink-0" />
                            <span className="text-neutral-300">
                              {exp.sub_company_name}
                            </span>
                            {exp.sub_company_location && (
                              <>
                                <MapPin className="w-3 h-3 text-neutral-600 shrink-0 ml-1" />
                                <span>{exp.sub_company_location}</span>
                              </>
                            )}
                          </div>
                        )}

                        <p className="text-[11px] text-neutral-500 font-mono">
                          {formatMonthYear(exp.start_date)} —{" "}
                          {exp.is_current
                            ? "Present"
                            : formatMonthYear(exp.end_date)}
                        </p>

                        <p className="text-xs text-neutral-400 line-clamp-2 max-w-2xl">
                          {exp.description}
                        </p>
                      </div>

                      {/* Right: Action Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleOpenEditExperience(exp)}
                          className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-900 transition-colors"
                          title="Edit Experience"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteExperience(exp)}
                          className="p-1.5 text-neutral-500 hover:text-red-400 rounded hover:bg-neutral-900 transition-colors"
                          title="Delete Experience"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Certifications List */}
          {activeTab === "certifications" && (
            <div>
              {loading ? (
                <div className="text-xs text-neutral-500 py-12 text-center">
                  Loading certifications...
                </div>
              ) : certifications.length === 0 ? (
                <div className="p-8 border border-neutral-800 rounded-lg bg-neutral-950/40 text-center space-y-3">
                  <p className="text-sm text-neutral-300 font-medium">
                    No certifications found
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {certifications.map((cert) => {
                    const isLive = cert.is_published;
                    return (
                      <div
                        key={cert.id}
                        className="flex items-center justify-between gap-4 px-5 py-4 border border-neutral-800/90 bg-neutral-950/60 rounded-lg hover:border-neutral-700 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {cert.image_url ? (
                            <img
                              src={cert.image_url}
                              alt={cert.name}
                              className="w-9 h-9 object-contain rounded border border-neutral-800 bg-black shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded border border-neutral-800 bg-neutral-900 flex items-center justify-center shrink-0">
                              <Award className="w-4 h-4 text-neutral-600" />
                            </div>
                          )}
                          <div className="space-y-1 min-w-0">
                            <h3 className="text-sm font-bold text-white truncate tracking-wide">
                              {cert.name}
                            </h3>
                            <p className="text-[11px] text-neutral-500 font-mono truncate">
                              {cert.issuer}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleCertificationPublish(cert)
                            }
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border transition-all ${
                              isLive
                                ? "bg-[var(--foreground)]/10 border-[var(--foreground)]/30 text-[var(--foreground)] hover:bg-[var(--foreground)]/15"
                                : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300"
                            }`}
                            title="Click to toggle Public / Draft status"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isLive
                                  ? "bg-[var(--foreground)] animate-pulse"
                                  : "bg-neutral-500"
                              }`}
                            />
                            <span>{isLive ? "Public" : "Draft"}</span>
                          </button>

                          <div className="h-4 w-[1px] bg-neutral-800" />

                          <div className="flex items-center gap-1">
                            {cert.credential_url && (
                              <a
                                href={cert.credential_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-900 transition-colors"
                                title="View Credential"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              onClick={() => handleOpenEditCertification(cert)}
                              className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-900 transition-colors"
                              title="Edit Certification"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteCertification(cert)
                              }
                              className="p-1.5 text-neutral-500 hover:text-red-400 rounded hover:bg-neutral-900 transition-colors"
                              title="Delete Certification"
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
                TECH_CATEGORIES.map((cat) => (
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

        </div>
      </main>

      {/* Modals */}
      {isProjectModalOpen && (
        <ProjectModal
          isOpen={isProjectModalOpen}
          onClose={() => setIsProjectModalOpen(false)}
          onSuccess={fetchProjects}
          projectToEdit={editingProject}
        />
      )}
      {isExperienceModalOpen && (
        <ExperienceModal
          isOpen={isExperienceModalOpen}
          onClose={() => setIsExperienceModalOpen(false)}
          onSuccess={fetchExperiences}
          experienceToEdit={editingExperience}
        />
      )}
      {isCertificationModalOpen && (
        <CertificationModal
          isOpen={isCertificationModalOpen}
          onClose={() => setIsCertificationModalOpen(false)}
          onSuccess={fetchCertifications}
          certificationToEdit={editingCertification}
        />
      )}
      <ConfirmDialog
        isOpen={!!pendingDelete}
        title={`Delete this ${pendingDelete?.type ?? ""}?`}
        message={`"${pendingDelete?.label}" will be permanently deleted. This can't be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmPendingDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}