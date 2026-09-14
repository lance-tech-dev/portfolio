"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Certification } from "@/types/portfolio";
import {
  X,
  Loader2,
  Trash2,
  Image as ImageIcon,
  Globe,
  Eye,
  EyeOff,
} from "lucide-react";

interface CertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  certificationToEdit?: Certification | null;
}

const toMonthInput = (date?: string | null) => (date ? date.slice(0, 7) : "");
const toDate = (month: string) => (month ? `${month}-01` : null);

export function CertificationModal({
  isOpen,
  onClose,
  onSuccess,
  certificationToEdit,
}: CertificationModalProps) {
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [category, setCategory] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (certificationToEdit) {
      setName(certificationToEdit.name || "");
      setIssuer(certificationToEdit.issuer || "");
      setCategory(certificationToEdit.category || "");
      setCredentialUrl(certificationToEdit.credential_url || "");
      setIssueDate(toMonthInput(certificationToEdit.issue_date));
      setImageUrl(certificationToEdit.image_url || "");
      setIsPublished(certificationToEdit.is_published ?? true);
    } else {
      setName("");
      setIssuer("");
      setCategory("");
      setCredentialUrl("");
      setIssueDate("");
      setImageUrl("");
      setIsPublished(true);
    }
    setError(null);
  }, [isOpen, certificationToEdit]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: session
          ? { Authorization: `Bearer ${session.access_token}` }
          : undefined,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload image");

      setImageUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      name,
      issuer,
      category: category || null,
      credential_url: credentialUrl || null,
      issue_date: toDate(issueDate),
      image_url: imageUrl || null,
      is_published: isPublished,
      updated_at: new Date().toISOString(),
    };

    const { error: dbError } = certificationToEdit
      ? await supabase
          .from("certifications")
          .update(payload)
          .eq("id", certificationToEdit.id)
      : await supabase.from("certifications").insert([payload]);

    if (dbError) {
      setError(dbError.message);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 font-mono">
      <div className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm shrink-0">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              {certificationToEdit ? "Edit Certification" : "Add Certification"}
            </h2>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Name, issuer, and a link to verify it
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

          <form id="certification-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-neutral-300 font-medium block">
                  Certification Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Generative AI Leader"
                  className="w-full bg-black border border-neutral-800 rounded-md px-3.5 py-2.5 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-300 font-medium block">
                  Visibility
                </label>
                <button
                  type="button"
                  onClick={() => setIsPublished(!isPublished)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md border font-semibold text-xs transition-all ${
                    isPublished
                      ? "bg-[var(--foreground)]/10 border-[var(--foreground)]/30 text-[var(--foreground)] hover:bg-[var(--foreground)]/15"
                      : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isPublished ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                    <span>{isPublished ? "Public" : "Draft"}</span>
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-medium block">
                  Issuer *
                </label>
                <input
                  type="text"
                  required
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="e.g. Google"
                  className="w-full bg-black border border-neutral-800 rounded-md px-3.5 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-medium block">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. AI, Cloud"
                  className="w-full bg-black border border-neutral-800 rounded-md px-3.5 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-medium block">
                  Issue Date
                </label>
                <input
                  type="month"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-md px-3.5 py-2 text-white focus:outline-none focus:border-neutral-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-300 font-medium flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-neutral-500" />
                <span>Credential / Verify URL</span>
              </label>
              <input
                type="url"
                value={credentialUrl}
                onChange={(e) => setCredentialUrl(e.target.value)}
                placeholder="https://www.credly.com/badges/..."
                className="w-full bg-black border border-neutral-800 rounded-md px-3.5 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
              />
            </div>

            {/* Badge / Logo Upload */}
            <div className="space-y-2 pt-2 border-t border-neutral-800/80">
              <label className="text-neutral-300 font-semibold block">
                Badge / Logo (Cloudflare R2)
              </label>

              {imageUrl ? (
                <div className="relative rounded-lg border border-neutral-800 bg-neutral-900/60 p-3 flex items-center gap-4">
                  <img
                    src={imageUrl}
                    alt="Badge preview"
                    className="w-16 h-16 object-contain rounded border border-neutral-800 bg-black shrink-0"
                  />
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-xs text-white font-semibold truncate">
                      Badge Uploaded
                    </p>
                    <p className="text-[10px] text-neutral-500 truncate">
                      {imageUrl}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="p-2 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded-md transition-colors"
                    title="Remove Badge"
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
                        : "Click to upload badge or logo"}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      PNG, JPG, SVG up to 10MB
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
            form="certification-form"
            disabled={isSubmitting || isUploading}
            className="px-5 py-2 bg-white text-black font-semibold rounded-md hover:bg-neutral-200 transition-colors text-xs disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : certificationToEdit
              ? "Update Certification"
              : "Save Certification"}
          </button>
        </div>
      </div>
    </div>
  );
}
