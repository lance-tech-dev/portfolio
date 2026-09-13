"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/components/theme-provider";
import {
  FolderGit2,
  Briefcase,
  Layers,
  Award,
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
} from "lucide-react";

export function Sidebar() {
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("projects");
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navItems = [
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "stack", label: "Stack", icon: Layers },
    { id: "certifications", label: "Certifications", icon: Award },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* ================= MOBILE / TABLET FIXED HEADER (< 1024px) ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 lg:hidden flex items-center justify-between px-5 py-4 bg-black/90 backdrop-blur-md border-b border-neutral-800/80 transition-colors">
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="text-sm font-bold tracking-tight text-white hover:text-neutral-300 transition-colors"
        >
          Lance Achacoso
        </Link>

        {/* Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 text-neutral-400 hover:text-white rounded-lg focus:outline-none transition-colors z-50"
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
        </button>
      </header>

      {/* ================= MOBILE / TABLET FULL-SCREEN MENU OVERLAY ================= */}
      <div
        className={`fixed inset-0 z-40 lg:hidden bg-black text-white font-mono flex flex-col justify-between p-6 pt-20 transition-all duration-300 ease-in-out ${
          isOpen
            ? "translate-x-0 opacity-100 pointer-events-auto"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="space-y-6">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                    isActive
                      ? "bg-neutral-900 text-white font-semibold"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-950"
                  }`}
                >
                  <Icon className="w-4 h-4 text-neutral-400" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-neutral-900 flex flex-col gap-6">
          {/* Theme Switcher Controls */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-semibold">Theme Mode</span>
            <div className="flex items-center gap-1 p-1 bg-neutral-950 border border-neutral-800 rounded-lg">
              <button
                type="button"
                onClick={(e) => setTheme("light", e)}
                className={`p-2 rounded transition-all ${
                  mounted && theme === "light"
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-500 hover:text-white"
                }`}
                title="Light Mode"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => setTheme("dark", e)}
                className={`p-2 rounded transition-all ${
                  mounted && theme === "dark"
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-500 hover:text-white"
                }`}
                title="Dark Mode"
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => setTheme("system", e)}
                className={`p-2 rounded transition-all ${
                  mounted && theme === "system"
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-500 hover:text-white"
                }`}
                title="System Preference"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Email Link */}
          <div className="space-y-1 text-xs text-neutral-500">
            <p className="leading-tight">For work, collabs & everything else:</p>
            <a
              href="mailto:achacosolance01@gmail.com"
              className="text-neutral-300 hover:text-white underline underline-offset-2 block transition-colors truncate"
            >
              achacosolance01@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP FIXED SIDEBAR (>= 1024px) ================= */}
      <aside className="hidden lg:flex fixed top-0 left-0 z-50 w-64 h-screen border-r border-neutral-800/80 bg-black text-white font-mono flex-col justify-between p-6 select-none overflow-y-auto transition-colors">
        {/* Top Header & Nav */}
        <div className="space-y-8">
          <div>
            <Link
              href="/"
              className="text-sm font-bold tracking-tight text-white hover:text-neutral-300 transition-colors"
            >
              Lance Achacoso
            </Link>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                    isActive
                      ? "bg-neutral-900 text-white font-semibold"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-950"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* Bottom Footer: Theme Switcher & Email */}
        <div className="space-y-4 pt-4 border-t border-neutral-900 text-[11px]">
          <div className="flex items-center gap-1 p-1 bg-neutral-950 border border-neutral-800 rounded-lg w-fit">
            <button
              type="button"
              onClick={(e) => setTheme("light", e)}
              className={`p-1.5 rounded transition-all ${
                mounted && theme === "light"
                  ? "bg-neutral-800 text-white"
                  : "text-neutral-500 hover:text-white"
              }`}
              title="Light Mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => setTheme("dark", e)}
              className={`p-1.5 rounded transition-all ${
                mounted && theme === "dark"
                  ? "bg-neutral-800 text-white"
                  : "text-neutral-500 hover:text-white"
              }`}
              title="Dark Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => setTheme("system", e)}
              className={`p-1.5 rounded transition-all ${
                mounted && theme === "system"
                  ? "bg-neutral-800 text-white"
                  : "text-neutral-500 hover:text-white"
              }`}
              title="System Preference"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1 text-neutral-500">
            <p className="leading-tight">For work, collabs & everything else:</p>
            <a
              href="mailto:achacosolance01@gmail.com"
              className="text-neutral-300 hover:text-white underline underline-offset-2 block transition-colors truncate"
            >
              achacosolance01@gmail.com
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}