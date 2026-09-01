"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Client-only mount gate to avoid a flash of the wrong icon before hydration
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />; // Invisible placeholder to stop layout shift
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
      aria-label="Toggle theme"
    >
      <Sun className="absolute w-5 h-5 transition-all scale-100 rotate-0 dark:scale-0 dark:-rotate-90 text-zinc-800" />
      <Moon className="absolute w-5 h-5 transition-all scale-0 rotate-90 dark:scale-100 dark:rotate-0 text-zinc-200" />
    </button>
  );
}