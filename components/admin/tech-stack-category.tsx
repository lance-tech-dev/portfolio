"use client";

import { useState } from "react";
import { TechCategory, TechStack } from "@/types/portfolio";
import { TECH_PRESETS } from "@/lib/constants/tech-presets";
import { Check, X, Search, ChevronDown, ChevronUp } from "lucide-react";

interface TechStackCategoryProps {
  category: TechCategory;
  selectedItems: TechStack[];
  onToggle: (name: string, category: TechCategory) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}

export function TechStackCategory({
  category,
  selectedItems,
  onToggle,
  onRemove,
}: TechStackCategoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const presetConfig = TECH_PRESETS[category];
  const categorySelected = selectedItems.filter(
    (item: TechStack) => item.category === category
  );
  const selectedNames = new Set(
    categorySelected.map((item: TechStack) => item.name.toLowerCase())
  );

  const filteredPresets = presetConfig.items.filter((item: string) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePresetClick = async (name: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const existing = categorySelected.find(
      (item: TechStack) => item.name.toLowerCase() === name.toLowerCase()
    );

    if (existing) {
      await onRemove(existing.id);
    } else {
      await onToggle(name, category);
    }

    setIsProcessing(false);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      e.preventDefault();
      const customName = searchQuery.trim();

      const existing = categorySelected.find(
        (item: TechStack) => item.name.toLowerCase() === customName.toLowerCase()
      );

      if (!existing) {
        setIsProcessing(true);
        await onToggle(customName, category);
        setIsProcessing(false);
      }
      setSearchQuery("");
    }
  };

  return (
    <div className="border border-neutral-800 bg-neutral-950 rounded-lg overflow-hidden font-mono text-xs">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-5 py-4 bg-neutral-900/40 hover:bg-neutral-900/80 cursor-pointer transition-colors border-b border-neutral-800/60"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-white text-sm">
            {presetConfig.label}
          </span>
          {categorySelected.length > 0 && (
            <span className="text-neutral-400 line-clamp-1 max-w-xl text-xs">
              {categorySelected.map((i: TechStack) => i.name).join(", ")}
            </span>
          )}
        </div>
        <button className="text-neutral-400 hover:text-white">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-5 space-y-5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Search ${presetConfig.label.toLowerCase()}, or type to add your own...`}
              className="w-full bg-black border border-neutral-800 rounded-md pl-9 pr-3 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
            />
          </div>

          {/* Preset Buttons Grid */}
          <div className="flex flex-wrap gap-2">
            {filteredPresets.map((name: string) => {
              const isSelected = selectedNames.has(name.toLowerCase());
              return (
                <button
                  key={name}
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handlePresetClick(name)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs transition-all ${
                    isSelected
                      ? "bg-neutral-800 border-neutral-600 text-white font-medium"
                      : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                  }`}
                >
                  <span>{name}</span>
                  {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                </button>
              );
            })}
          </div>

          {/* Selected Pills */}
          {categorySelected.length > 0 && (
            <div className="pt-4 border-t border-neutral-900 space-y-2">
              <span className="text-neutral-500 text-[11px] font-semibold uppercase tracking-wider block">
                Selected ({categorySelected.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {categorySelected.map((item: TechStack) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-white text-xs"
                  >
                    <span>{item.name}</span>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => onRemove(item.id)}
                      className="text-neutral-500 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}