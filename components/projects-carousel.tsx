"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Project } from "@/types/portfolio";
import { ArrowUpRight, ChevronLeft, ChevronRight, Layers } from "lucide-react";

export function ProjectsCarousel({ projects }: { projects: Project[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <>
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
          01 — PROJECTS
        </h2>
        <div className="flex items-center gap-3">
        {projects.length > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800 rounded transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-neutral-500 font-mono px-1">
              {activeIndex + 1}/{projects.length}
            </span>
            <button
              onClick={handleNext}
              className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800 rounded transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
          <Link
            href="/projects"
            className="text-[10px] text-neutral-500 hover:text-white uppercase tracking-wider font-semibold transition-colors"
          >
            ALL PROJECTS →
          </Link>
        </div>
      </div>

      {/* Fanned Out Card Deck Container */}
      <div className="relative min-h-[400px] sm:min-h-[420px] w-full flex items-center justify-center py-6 overflow-visible">
        {projects.map((project, index) => {
          const total = projects.length;
          let offset = (index - activeIndex + total) % total;

          if (offset > total / 2) offset -= total;

          const isActive = offset === 0;
          const isRight = offset === 1 || (total === 2 && offset === -1);
          const isLeft = offset === -1;
          const isHidden = Math.abs(offset) > 1;

          // Bryl Lim Fanning Rotation & Scale
          let transformStyle = "translate3d(0px, 0px, 0px) rotate(0deg) scale(1)";
          let zIndex = 30;
          let opacity = 1;
          let cursorStyle = "cursor-default";

          if (isLeft) {
            transformStyle = "translate3d(-105px, 20px, -40px) rotate(-11deg) scale(0.92)";
            zIndex = 10;
            opacity = 0.5;
            cursorStyle = "cursor-pointer hover:opacity-80";
          } else if (isRight) {
            transformStyle = "translate3d(105px, 20px, -40px) rotate(11deg) scale(0.92)";
            zIndex = 20;
            opacity = 0.5;
            cursorStyle = "cursor-pointer hover:opacity-80";
          } else if (isHidden) {
            transformStyle = "translate3d(0px, 40px, -80px) rotate(0deg) scale(0.82)";
            zIndex = 0;
            opacity = 0;
            cursorStyle = "pointer-events-none";
          }

          return (
            <div
              key={project.id}
              onClick={() => {
                if (!isActive && !isHidden) {
                  setActiveIndex(index);
                }
              }}
              style={{
                zIndex,
                opacity,
                transform: transformStyle,
                transition: "all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)",
              }}
              className={`absolute w-[310px] sm:w-[350px] bg-neutral-950 border border-neutral-800 rounded-3xl p-5 shadow-2xl flex flex-col justify-between select-none ${cursorStyle}`}
            >
              {/* Thumbnail Container */}
              {project.thumbnail_url ? (
                <div className="relative w-full h-44 sm:h-48 rounded-2xl border border-neutral-800/80 overflow-hidden bg-black shrink-0">
                  <Image
                    src={project.thumbnail_url}
                    alt={project.title}
                    fill
                    sizes="350px"
                    loading={isActive ? "eager" : "lazy"}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-44 sm:h-48 rounded-2xl border border-neutral-800 bg-neutral-900/50 flex items-center justify-center text-neutral-600 shrink-0">
                  <Layers className="w-8 h-8 stroke-[1.5]" />
                </div>
              )}

              {/* Project Title Only */}
              <div className="my-3">
                <h3 className="text-base font-bold text-white tracking-wide truncate">
                  {project.title}
                </h3>
              </div>

              {/* Live Preview Button */}
              {project.demo_url ? (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => !isActive && e.preventDefault()}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white text-black font-semibold rounded-xl text-xs hover:bg-neutral-200 transition-colors shadow-sm"
                >
                  <span>Live Preview</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              ) : (
                <div className="w-full py-2.5 text-center text-[11px] text-neutral-600 font-mono">
                  No live link available
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
