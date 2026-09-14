"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (SelectOption | string)[];
  placeholder?: string;
  className?: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const normalized: SelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );
  const selected = normalized.find((o) => o.value === value);
  const selectedIndex = normalized.findIndex((o) => o.value === value);

  useEffect(() => {
    if (!isOpen) return;

    setHighlighted(selectedIndex >= 0 ? selectedIndex : 0);

    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      optionRefs.current[highlighted]?.scrollIntoView({ block: "nearest" });
    }
  }, [isOpen, highlighted]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(true);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((prev) => Math.min(prev + 1, normalized.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const option = normalized[highlighted];
      if (option) {
        onChange(option.value);
        setIsOpen(false);
      }
    } else if (e.key === "Tab") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className="w-full flex items-center justify-between gap-2 bg-black border border-neutral-800 rounded-md px-3.5 py-2 text-left text-white hover:border-neutral-700 focus:outline-none focus:border-neutral-500 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={selected ? "" : "text-neutral-600"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-neutral-500 shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          onKeyDown={handleListKeyDown}
          className="absolute z-20 mt-1.5 w-full max-h-56 overflow-y-auto bg-neutral-950 border border-neutral-800 rounded-md shadow-2xl py-1 custom-scrollbar focus:outline-none"
          ref={(el) => el?.focus()}
        >
          {normalized.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlighted;
            return (
              <button
                key={option.value}
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                type="button"
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHighlighted(index)}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3.5 py-2 text-left text-xs transition-colors ${
                  isSelected
                    ? "bg-neutral-900 text-white font-medium"
                    : isHighlighted
                    ? "bg-neutral-900/60 text-white"
                    : "text-neutral-400"
                }`}
              >
                <span>{option.label}</span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-[var(--foreground)] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
