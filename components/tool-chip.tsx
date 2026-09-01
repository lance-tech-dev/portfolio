"use client";

import { useState, type ReactNode } from "react";

type Tool = {
  name: string;
  icon: ReactNode;
};

export function ToolChipGroup({ tools }: { tools: Tool[] }) {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  return (
    <>
      {tools.map((tool) => {
        const isOpen = activeTool === tool.name;
        return (
          <div key={tool.name} className="relative">
            <button
              type="button"
              aria-label={tool.name}
              onClick={() =>
                setActiveTool((current) => (current === tool.name ? null : tool.name))
              }
              onBlur={() =>
                setActiveTool((current) => (current === tool.name ? null : current))
              }
              className="peer flex items-center justify-center w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/40 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 transition-all duration-200"
            >
              {tool.icon}
            </button>
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute top-full mt-2 sm:top-auto sm:bottom-full sm:mt-0 sm:mb-2 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap rounded-md bg-zinc-900 dark:bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-50 dark:text-zinc-900 shadow-md transition-all duration-150 peer-hover:opacity-100 peer-hover:scale-100 ${
                isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              {tool.name}
              <span className="absolute bottom-full sm:bottom-auto sm:top-full left-1/2 -translate-x-1/2 h-0 w-0 border-4 border-transparent border-b-zinc-900 dark:border-b-zinc-100 sm:border-b-transparent sm:dark:border-b-transparent sm:border-t-zinc-900 sm:dark:border-t-zinc-100" />
            </span>
          </div>
        );
      })}
    </>
  );
}
