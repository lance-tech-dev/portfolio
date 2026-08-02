import { Mail } from "lucide-react";
import { portfolioData } from "@/app/data/portfolio-data";

export function CtaFooter() {
  return (
    <section className="mt-32">
      <div className="rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 md:p-16 text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full" />

        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Let&apos;s build something impactful.
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
            Whether you need a full-stack application built from scratch or high-level technical troubleshooting, I&apos;m currently open for new projects.
          </p>
        </div>

        <div className="relative z-10 flex justify-center pt-4">
          <a
            href={portfolioData.header.socials.email}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-emerald-500/20"
          >
            <Mail size={20} />
            <span>Say Hello</span>
          </a>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-500 dark:text-zinc-400 text-sm">
        <p>© {new Date().getFullYear()} Lance Achacoso. All rights reserved.</p>
        <div className="flex gap-6">
          <a href={portfolioData.header.socials.github} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">GitHub</a>
          <a href={portfolioData.header.socials.linkedin} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">LinkedIn</a>
          <a href={portfolioData.header.socials.facebook} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Facebook</a>
          <a href={portfolioData.header.socials.instagram} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Instagram</a>
        </div>
      </footer>
    </section>
  );
}
