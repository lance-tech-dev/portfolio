"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { flushSync } from "react-dom";

type Theme = "dark" | "light" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme, event?: React.MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);
  const activeAnimationRef = useRef<Animation | null>(null);

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme) || "dark";
    setThemeState(saved);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const target =
        theme === "system"
          ? mediaQuery.matches
            ? "dark"
            : "light"
          : theme;

      if (target === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.add("light");
        root.classList.remove("dark");
      }
    };

    applyTheme();
    localStorage.setItem("theme", theme);

    const handleChange = () => {
      if (theme === "system") applyTheme();
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme, event?: React.MouseEvent) => {
    // Prevent redundant triggers if clicking the currently active mode
    if (newTheme === theme) return;

    // Immediately cancel any running ripple animation to prevent stacking glitches
    if (activeAnimationRef.current) {
      activeAnimationRef.current.cancel();
      activeAnimationRef.current = null;
    }

    // Fallback if View Transitions API is unsupported or reduced motion is enabled
    if (
      typeof document === "undefined" ||
      !(document as any).startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setThemeState(newTheme);
      return;
    }

    const x = event?.clientX ?? window.innerWidth / 2;
    const y = event?.clientY ?? window.innerHeight / 2;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    try {
      const transition = (document as any).startViewTransition(() => {
        flushSync(() => {
          setThemeState(newTheme);
        });
      });

      transition.ready
        .then(() => {
          const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ];

          const anim = document.documentElement.animate(
            {
              clipPath: clipPath,
            },
            {
              duration: 450,
              easing: "cubic-bezier(0.25, 1, 0.5, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );

          activeAnimationRef.current = anim;

          anim.onfinish = () => {
            if (activeAnimationRef.current === anim) {
              activeAnimationRef.current = null;
            }
          };

          anim.oncancel = () => {
            if (activeAnimationRef.current === anim) {
              activeAnimationRef.current = null;
            }
          };
        })
        .catch(() => {
          // Gracefully ignore aborted transitions on rapid clicks
        });
    } catch {
      setThemeState(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};