"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

const OPTIONS = [
  { value: "light", icon: Sun, title: "Light Mode" },
  { value: "dark", icon: Moon, title: "Dark Mode" },
] as const;

// One PQRST-style beat (mostly flat, one sharp complex), duplicated with a
// +100 offset so the 200-unit strip loops seamlessly while scrolling.
const BEAT =
  "0,10 55,10 58,9 60,10 62,10 63,11.5 64,1 65,19 66,10 70,10 73,7 76,9.5 80,10 100,10";
const ECG_POINTS = `${BEAT} ${BEAT.split(" ")
  .map((p) => {
    const [x, y] = p.split(",");
    return `${Number(x) + 100},${y}`;
  })
  .join(" ")}`;

function HeartbeatPulse() {
  return (
    <div
      className="relative flex-1 min-w-[36px] h-full overflow-hidden"
      style={{
        // Chasing-tail effect: newest data (right, where the scroll feeds
        // in) stays bright, older data (left) fades out behind it.
        maskImage: "linear-gradient(to right, transparent, black 55%)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 55%)",
      }}
    >
      <svg
        className="absolute inset-y-0 left-0 h-full w-[200%] animate-heartbeat-scroll"
        viewBox="0 0 200 20"
        preserveAspectRatio="none"
      >
        <polyline
          points={ECG_POINTS}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
          style={{ filter: "drop-shadow(0 0 2.5px var(--foreground))" }}
        />
      </svg>
    </div>
  );
}

export function ThemeToggle({ size = "sm" }: { size?: "sm" | "md" }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const buttonPadding = size === "md" ? "p-2" : "p-1.5";
  const iconSize = size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";
  const boxHeight = size === "md" ? "h-8" : "h-7";

  return (
    <div
      className={`flex items-center gap-1 ${boxHeight} bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden`}
    >
      {OPTIONS.map(({ value, icon: Icon, title }) => (
        <button
          key={value}
          type="button"
          onClick={(e) => setTheme(value, e)}
          className={`${buttonPadding} rounded transition-all shrink-0 ${
            mounted && theme === value
              ? "bg-neutral-800 text-white"
              : "text-neutral-500 hover:text-white"
          }`}
          title={title}
        >
          <Icon className={iconSize} />
        </button>
      ))}
      <HeartbeatPulse />
    </div>
  );
}
