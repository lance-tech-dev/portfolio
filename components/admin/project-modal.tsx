"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Project, TechStack } from "@/types/portfolio";
import {
  X,
  Upload,
  Loader2,
  Check,
  Plus,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Search,
  Globe,
  Trash2,
} from "lucide-react";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectToEdit?: Project | null;
}

export function ProjectModal({
  isOpen,
  onClose,
  onSuccess,
  projectToEdit,
}: ProjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [techInput, setTechInput] = useState("");
  const [techSearch, setTechSearch] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [availableStacks, setAvailableStacks] = useState<TechStack[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (projectToEdit) {
      setTitle(projectToEdit.title || "");
      setDescription(projectToEdit.description || "");
      setDemoUrl(projectToEdit.demo_url || "");
      setGithubUrl(projectToEdit.github_url || "");
      setTechStack(projectToEdit.tech_stack || []);
      setThumbnailUrl(projectToEdit.thumbnail_url || "");
      setIsPublished(projectToEdit.is_published ?? true);
    } else {
      setTitle("");
      setDescription("");
      setDemoUrl("");
      setGithubUrl("");
      setTechStack([]);
      setThumbnailUrl("");
      setIsPublished(true);
    }

    const fetchConfiguredStacks = async () => {
      const { data } = await supabase
        .from("tech_stacks")
        .select("*")
        .order("category", { ascending: true });

      if (data) setAvailableStacks(data as TechStack[]);
    };

    fetchConfiguredStacks();
  }, [isOpen, projectToEdit]);

  if (!isOpen) return null;

  const toggleTechPill = (techName: string) => {
    if (techStack.includes(techName)) {
      setTechStack(techStack.filter((t) => t !== techName));
    } else {
      setTechStack([...techStack, techName]);
    }
  };

  const handleAddCustomTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && techInput.trim()) {
      e.preventDefault();
      const tag = techInput.trim().replace(",", "");
      if (!techStack.includes(tag)) {
        setTechStack([...techStack, tag]);
      }
      setTechInput("");
    }
  };

  const removeTech = (tagToRemove: string) => {
    setTechStack(techStack.filter((tag) => tag !== tagToRemove));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload image");

      setThumbnailUrl(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const payload = {
      title,
      slug,
      description,
      demo_url: demoUrl || null,
      github_url: githubUrl || null,
      tech_stack: techStack,
      thumbnail_url: thumbnailUrl || null,
      is_published: isPublished,
      updated_at: new Date().toISOString(),
    };

    let dbError = null;

    if (projectToEdit) {
      const { error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", projectToEdit.id);
      dbError = error;
    } else {
      const { error } = await supabase.from("projects").insert([payload]);
      dbError = error;
    }

    if (dbError) {
      setError(dbError.message);
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
      onSuccess();
      onClose();
    }
  };

  // Group available stacks by category
  const groupedStacks = availableStacks.reduce<Record<string, TechStack[]>>(
    (acc, stack) => {
      if (
        techSearch.trim() &&
        !stack.name.toLowerCase().includes(techSearch.toLowerCase())
      ) {
        return acc;
      }
      acc[stack.category] = acc[stack.category] || [];
      acc[stack.category].push(stack);
      return acc;
    },
    {}
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 font-mono">
      <div className="w-full max-w-3xl bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm shrink-0">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              {projectToEdit ? "Edit Project" : "Create Project"}
            </h2>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Configure project metadata, links, media, and tech stack
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs custom-scrollbar">
          {error && (
            <div className="p-3 border border-red-900/80 bg-red-950/40 text-red-400 rounded-md text-xs">
              {error}
            </div>
          )}

          <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Title + Public Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-neutral-300 font-medium block">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. TQ Devs Digital"
                  className="w-full bg-black border border-neutral-800 rounded-md px-3.5 py-2.5 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-300 font-medium block">
                  Visibility Status
                </label>
                <button
                  type="button"
                  onClick={() => setIsPublished(!isPublished)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md border font-semibold text-xs transition-all ${
                    isPublished
                      ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-400 hover:bg-emerald-900/30"
                      : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isPublished ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                    <span>{isPublished ? "Public" : "Draft (Hidden)"}</span>
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isPublished ? "bg-emerald-400 animate-pulse" : "bg-neutral-600"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-neutral-300 font-medium block">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Overview of features, scope, and technical highlights..."
                className="w-full bg-black border border-neutral-800 rounded-md px-3.5 py-2.5 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
              />
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-medium flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Demo / Live URL</span>
                </label>
                <input
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://www.tqdevs.com"
                  className="w-full bg-black border border-neutral-800 rounded-md px-3.5 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-300 font-medium flex items-center gap-1.5">
                  <span className="text-neutral-500 text-xs font-bold">git</span>
                  <span>GitHub Repository URL</span>
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/user/repo"
                  className="w-full bg-black border border-neutral-800 rounded-md px-3.5 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                />
              </div>
            </div>

            {/* Thumbnail Upload Dropzone */}
            <div className="space-y-2 pt-2 border-t border-neutral-800/80">
              <label className="text-neutral-300 font-semibold block">
                Project Thumbnail (Cloudflare R2)
              </label>

              {thumbnailUrl ? (
                <div className="relative rounded-lg border border-neutral-800 bg-neutral-900/60 p-3 flex items-center gap-4">
                  <img
                    src={thumbnailUrl}
                    alt="Thumbnail preview"
                    className="w-24 h-16 object-cover rounded border border-neutral-800 bg-black shrink-0"
                  />
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-xs text-white font-semibold truncate">
                      Thumbnail Uploaded
                    </p>
                    <p className="text-[10px] text-neutral-500 truncate">
                      {thumbnailUrl}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setThumbnailUrl("")}
                    className="p-2 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded-md transition-colors"
                    title="Remove Thumbnail"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-neutral-800 hover:border-neutral-600 rounded-lg p-6 bg-neutral-900/20 hover:bg-neutral-900/40 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-neutral-500 group-hover:text-white transition-colors" />
                  )}
                  <div className="text-center">
                    <p className="text-xs text-neutral-300 font-medium">
                      {isUploading
                        ? "Uploading to Cloudflare R2..."
                        : "Click to upload project cover"}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      PNG, JPG, WebP up to 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Tech Stack Integration Section */}
            <div className="space-y-4 pt-4 border-t border-neutral-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-neutral-200">
                    Tech Stack Integration
                  </h3>
                  <p className="text-[10px] text-neutral-500">
                    Select tools from your stack or add custom technologies
                  </p>
                </div>
                {techStack.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setTechStack([])}
                    className="text-[10px] text-neutral-500 hover:text-red-400 transition-colors"
                  >
                    Clear all ({techStack.length})
                  </button>
                )}
              </div>

              {/* Selected Pills Summary */}
              {techStack.length > 0 && (
                <div className="p-3 border border-neutral-800 bg-neutral-900/40 rounded-lg space-y-2">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                    Selected Stack ({techStack.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {techStack.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 bg-white text-black font-semibold px-2.5 py-1 rounded text-[11px] shadow-sm"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTech(tag)}
                          className="text-neutral-500 hover:text-black transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Selector Box */}
              <div className="border border-neutral-800 bg-neutral-900/20 rounded-lg p-3 space-y-3">
                {/* Search / Custom Tag Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      value={techSearch}
                      onChange={(e) => setTechSearch(e.target.value)}
                      placeholder="Filter stack tools..."
                      className="w-full bg-black border border-neutral-800 rounded-md pl-8 pr-3 py-1.5 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600"
                    />
                  </div>

                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleAddCustomTech}
                    placeholder="Type custom tech + Enter..."
                    className="w-full bg-black border border-neutral-800 rounded-md px-3 py-1.5 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600"
                  />
                </div>

                {/* Grouped Available Pills */}
                {Object.keys(groupedStacks).length > 0 ? (
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1 pt-1 custom-scrollbar">
                    {Object.entries(groupedStacks).map(([category, items]) => (
                      <div key={category} className="space-y-1">
                        <span className="text-[10px] text-neutral-500 block font-semibold uppercase tracking-wider">
                          {category}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {items.map((item) => {
                            const isSelected = techStack.includes(item.name);
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => toggleTechPill(item.name)}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] border transition-all ${
                                  isSelected
                                    ? "bg-neutral-800 border-neutral-600 text-white font-medium"
                                    : "bg-black text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white"
                                }`}
                              >
                                {isSelected ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Plus className="w-3 h-3 text-neutral-500" />
                                )}
                                <span>{item.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-neutral-500 py-2 text-center">
                    No matching configured stack items found. Type above to add a custom technology.
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Sticky Action Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-800 bg-neutral-950/80 backdrop-blur-sm shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-neutral-400 hover:text-white transition-colors text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="project-form"
            disabled={isSubmitting || isUploading}
            className="px-5 py-2 bg-white text-black font-semibold rounded-md hover:bg-neutral-200 transition-colors text-xs disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : projectToEdit
              ? "Update Project"
              : "Save Project"}
          </button>
        </div>
      </div>
    </div>
  );
}