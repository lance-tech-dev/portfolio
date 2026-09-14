"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Experience, EmploymentType, WorkSetup } from "@/types/portfolio";
import { X, Building2, MapPin } from "lucide-react";
import { Select } from "@/components/admin/select";

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  experienceToEdit?: Experience | null;
}

const WORK_SETUPS: WorkSetup[] = ["Onsite", "Remote", "Hybrid"];
const EMPLOYMENT_TYPES: EmploymentType[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
];

// DB stores DATE ("YYYY-MM-DD"); <input type="month"> wants "YYYY-MM".
const toMonthInput = (date?: string | null) => (date ? date.slice(0, 7) : "");
const toDate = (month: string) => (month ? `${month}-01` : null);

export function ExperienceModal({
  isOpen,
  onClose,
  onSuccess,
  experienceToEdit,
}: ExperienceModalProps) {
  const [role, setRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [hasSubCompany, setHasSubCompany] = useState(false);
  const [subCompanyName, setSubCompanyName] = useState("");
  const [subCompanyLocation, setSubCompanyLocation] = useState("");
  const [setup, setSetup] = useState<WorkSetup>("Onsite");
  const [employmentType, setEmploymentType] =
    useState<EmploymentType>("Full-time");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (experienceToEdit) {
      setRole(experienceToEdit.role || "");
      setCompanyName(experienceToEdit.company_name || "");
      setCompanyLocation(experienceToEdit.company_location || "");
      setHasSubCompany(!!experienceToEdit.sub_company_name);
      setSubCompanyName(experienceToEdit.sub_company_name || "");
      setSubCompanyLocation(experienceToEdit.sub_company_location || "");
      setSetup(experienceToEdit.setup || "Onsite");
      setEmploymentType(experienceToEdit.employment_type || "Full-time");
      setStartDate(toMonthInput(experienceToEdit.start_date));
      setEndDate(toMonthInput(experienceToEdit.end_date));
      setIsCurrent(experienceToEdit.is_current);
      setDescription(experienceToEdit.description || "");
    } else {
      setRole("");
      setCompanyName("");
      setCompanyLocation("");
      setHasSubCompany(false);
      setSubCompanyName("");
      setSubCompanyLocation("");
      setSetup("Onsite");
      setEmploymentType("Full-time");
      setStartDate("");
      setEndDate("");
      setIsCurrent(false);
      setDescription("");
    }
    setError(null);
  }, [isOpen, experienceToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCurrent && !endDate) {
      setError("Set an end date, or mark this as your current role.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = {
      role,
      company_name: companyName,
      company_location: companyLocation,
      sub_company_name: hasSubCompany && subCompanyName ? subCompanyName : null,
      sub_company_location:
        hasSubCompany && subCompanyLocation ? subCompanyLocation : null,
      setup,
      employment_type: employmentType,
      start_date: toDate(startDate),
      end_date: isCurrent ? null : toDate(endDate),
      is_current: isCurrent,
      description,
      updated_at: new Date().toISOString(),
    };

    const { error: dbError } = experienceToEdit
      ? await supabase
          .from("experience")
          .update(payload)
          .eq("id", experienceToEdit.id)
      : await supabase.from("experience").insert([payload]);

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
      <div className="w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm shrink-0">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              {experienceToEdit ? "Edit Experience" : "Add Experience"}
            </h2>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Role, employer, and (optionally) where you were deployed
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

          <form id="experience-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Role */}
            <div className="space-y-1.5">
              <label className="text-neutral-300 font-medium block">
                Role / Job Title *
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Technical Support Engineer"
                className="w-full bg-black border border-neutral-800 rounded-md px-3.5 py-2.5 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
              />
            </div>

            {/* Main Company */}
            <div className="space-y-3 p-3 border border-neutral-800 bg-neutral-900/20 rounded-lg">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                Employer
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-neutral-300 font-medium block">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Manpower Outsourcing Services Inc."
                    className="w-full bg-black border border-neutral-800 rounded-md px-3.5 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-neutral-300 font-medium flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-neutral-500" />
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyLocation}
                    onChange={(e) => setCompanyLocation(e.target.value)}
                    placeholder="e.g. Pasig City"
                    className="w-full bg-black border border-neutral-800 rounded-md px-3.5 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Sub Company Toggle */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setHasSubCompany(!hasSubCompany)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md border font-medium text-xs transition-all ${
                  hasSubCompany
                    ? "bg-neutral-900 border-neutral-600 text-white"
                    : "bg-black border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white"
                }`}
              >
                <span>Deployed / assigned to a different company?</span>
                <span className="text-[10px] text-neutral-500">
                  {hasSubCompany ? "Remove" : "Add sub-company"}
                </span>
              </button>

              {hasSubCompany && (
                <div className="space-y-3 p-3 border border-neutral-800 bg-neutral-900/20 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    Deployed At (Sub-company)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-neutral-300 font-medium block">
                        Sub-company Name
                      </label>
                      <input
                        type="text"
                        value={subCompanyName}
                        onChange={(e) => setSubCompanyName(e.target.value)}
                        placeholder="e.g. Huawei Technologies Phi."
                        className="w-full bg-black border border-neutral-800 rounded-md px-3.5 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-neutral-300 font-medium flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-neutral-500" />
                        Location
                      </label>
                      <input
                        type="text"
                        value={subCompanyLocation}
                        onChange={(e) => setSubCompanyLocation(e.target.value)}
                        placeholder="e.g. BGC, Taguig"
                        className="w-full bg-black border border-neutral-800 rounded-md px-3.5 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Setup & Employment Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-medium block">
                  Work Setup *
                </label>
                <Select
                  value={setup}
                  onChange={(v) => setSetup(v as WorkSetup)}
                  options={[...WORK_SETUPS]}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-medium block">
                  Employment Type *
                </label>
                <Select
                  value={employmentType}
                  onChange={(v) => setEmploymentType(v as EmploymentType)}
                  options={[...EMPLOYMENT_TYPES]}
                />
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-neutral-300 font-medium block">
                    Start Date *
                  </label>
                  <input
                    type="month"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded-md px-3.5 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-neutral-300 font-medium block">
                    End Date {!isCurrent && "*"}
                  </label>
                  <input
                    type="month"
                    required={!isCurrent}
                    disabled={isCurrent}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded-md px-3.5 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors disabled:opacity-40"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-neutral-300 cursor-pointer select-none w-fit">
                <input
                  type="checkbox"
                  checked={isCurrent}
                  onChange={(e) => {
                    setIsCurrent(e.target.checked);
                    if (e.target.checked) setEndDate("");
                  }}
                  className="accent-white w-3.5 h-3.5"
                />
                <span>I currently work here</span>
              </label>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-neutral-300 font-medium block">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Responsibilities, achievements, and technologies used..."
                className="w-full bg-black border border-neutral-800 rounded-md px-3.5 py-2.5 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
              />
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
            form="experience-form"
            disabled={isSubmitting}
            className="px-5 py-2 bg-white text-black font-semibold rounded-md hover:bg-neutral-200 transition-colors text-xs disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : experienceToEdit
              ? "Update Experience"
              : "Save Experience"}
          </button>
        </div>
      </div>
    </div>
  );
}
