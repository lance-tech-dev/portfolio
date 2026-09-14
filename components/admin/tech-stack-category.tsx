"use client";

import { useState } from "react";
import { TechCategory, TechStack } from "@/types/portfolio";
import { TECH_PRESETS } from "@/lib/constants/tech-presets";
import { X, Plus, Search, ChevronDown, ChevronUp } from "lucide-react";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const presetConfig = TECH_PRESETS[category];
  const categorySelected = selectedItems.filter(
    (item: TechStack) => item.category === category
  );
  const selectedByName = new Map(
    categorySelected.map((item: TechStack) => [item.name.toLowerCase(), item])
  );

  // Single merged, deduped list: presets + any custom entries already added,
  // so every item shows in exactly one place instead of twice.
  const allNames = Array.from(
    new Set([
      ...presetConfig.items,
      ...categorySelected.map((item) => item.name),
    ])
  );
  const filteredNames = allNames.filter((name) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePillClick = async (name: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const existing = selectedByName.get(name.toLowerCase());
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

      if (!selectedByName.has(customName.toLowerCase())) {
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
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 bg-neutral-900/40 hover:bg-neutral-900/80 transition-colors border-b border-neutral-800/60 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-bold text-white text-sm shrink-0">
            {presetConfig.label}
          </span>
          {categorySelected.length > 0 && (
            <span className="text-neutral-500 truncate text-xs">
              {categorySelected.map((i: TechStack) => i.name).join(", ")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {categorySelected.length > 0 && (
            <span className="text-[10px] text-neutral-500 font-semibold">
              {categorySelected.length}
            </span>
          )}
          <span className="text-neutral-400">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </span>
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-5 space-y-4">
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

          {/* Unified Pill Grid */}
          <div className="flex flex-wrap gap-2">
            {filteredNames.map((name) => {
              const isSelected = selectedByName.has(name.toLowerCase());
              return (
                <button
                  key={name}
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handlePillClick(name)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs transition-all disabled:opacity-50 ${
                    isSelected
                      ? "bg-neutral-800 border-neutral-600 text-white font-medium"
                      : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                  }`}
                >
                  <span>{name}</span>
                  {isSelected ? (
                    <X className="w-3 h-3 text-neutral-400" />
                  ) : (
                    <Plus className="w-3 h-3 text-neutral-600" />
                  )}
                </button>
              );
            })}
            {filteredNames.length === 0 && (
              <p className="text-neutral-600 py-1">
                No matches — press Enter above to add it as a custom entry.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
