"use client";

import Image from "next/image";
import { personalInfo } from "@/app/data";
import { ArrowUpRight, MapPin } from "lucide-react";

export function Hero() {
  return (
    <section className="space-y-10 pb-12 border-b border-neutral-800">
      {/* Status & Location Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-heartbeat-ping absolute inline-flex h-full w-full rounded-full bg-[var(--foreground)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--foreground)]"></span>
          </span>
          <span>{personalInfo.status}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
          <span>{personalInfo.location}</span>
        </div>
      </div>

      {/* Hero Layout: 2-Column down to 640px (sm), centered stack on small mobile */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start justify-start">
        {/* Profile Image - Centered on mobile (< sm), left-aligned on sm+ */}
        <div className="w-[160px] sm:w-[180px] lg:w-[220px] shrink-0 mx-auto sm:mx-0">
          <div className="relative aspect-[4/5] w-full rounded-md overflow-hidden bg-neutral-900 border border-neutral-800">
            <Image
              src={personalInfo.avatarUrl}
              alt={personalInfo.name}
              fill
              priority
              sizes="(min-width: 1024px) 220px, (min-width: 640px) 180px, 160px"
              className="object-cover contrast-125"
            />
            <div className="absolute inset-0 flex items-center justify-center text-neutral-600 font-mono text-xs -z-10">
              [ Add Photo ]
            </div>
          </div>
        </div>

        {/* Info & Bio */}
        <div className="space-y-6 flex-1 min-w-0">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-mono">
              {personalInfo.name}
            </h1>
            <p className="text-sm font-mono text-neutral-400">
              {personalInfo.role}
            </p>
          </div>

          <div className="space-y-4 text-neutral-300 text-sm leading-relaxed max-w-xl">
            {personalInfo.bio.map((paragraph, index) => (
              <p
                key={index}
                className={
                  index === personalInfo.bio.length - 1
                    ? "font-medium text-white"
                    : ""
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-xs">
            {personalInfo.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1 text-neutral-300 hover:text-white underline decoration-neutral-700 underline-offset-4 hover:decoration-white transition-colors"
              >
                <span>{social.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}