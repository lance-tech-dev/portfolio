"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { X, Upload, Loader2 } from "lucide-react";

interface TechStackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORY_OPTIONS = [
  "Development",
  "Design",
  "Productivity",
  "Infrastructure & Hosting",
  "AI Tools",
  "Hardware",
];

export function TechStackModal({
  isOpen,
  onClose,
  onSuccess,
}: TechStackModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Development");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

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
      if (!res.ok) throw new Error(data.error || "Failed to upload icon");

      setIconUrl(data.url);
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

    const { error: dbError } = await supabase.from("tech_stacks").insert([
      {
        name,
        category,
        description,
        url: url || null,
        icon_url: iconUrl || null,
      },
    ]);

    if (dbError) {
      setError(dbError.message);
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
      setName("");
      setDescription("");
      setUrl("");
      setIconUrl("");
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Add Stack Item
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 border border-red-900 bg-red-950/50 text-red-400 text-xs rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Tool Name */}
          <div className="space-y-1">
            <label className="text-neutral-400">Tool / Software Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Next.js, Raycast, Figma"
              className="w-full bg-black border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1">
            <label className="text-neutral-400">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-black border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description / Use Case */}
          <div className="space-y-1">
            <label className="text-neutral-400">Description / Role *</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. React framework for production"
              className="w-full bg-black border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
            />
          </div>

          {/* Tool Website URL */}
          <div className="space-y-1">
            <label className="text-neutral-400">Website URL (Optional)</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://nextjs.org"
              className="w-full bg-black border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
            />
          </div>

          {/* Icon Upload */}
          <div className="space-y-2 pt-2 border-t border-neutral-800">
            <label className="text-neutral-400">Icon / Logo (Optional - R2 Storage)</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-3 py-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 rounded cursor-pointer transition-colors text-neutral-300">
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Upload className="w-4 h-4 text-white" />
                )}
                <span>{isUploading ? "Uploading..." : "Upload Logo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              {iconUrl && (
                <div className="w-8 h-8 rounded border border-neutral-800 overflow-hidden shrink-0 bg-neutral-900 p-1">
                  <img
                    src={iconUrl}
                    alt="Icon preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-4 py-2 bg-white text-black font-semibold rounded hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}