"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/stack", label: "Stack" },
  { href: "/certifications", label: "Certifications" },
];

function NavLink({
  href,
  label,
  isActive,
  onClick,
  className = "",
}: {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block transition-colors ${
        isActive
          ? "text-white font-semibold"
          : "text-neutral-400 hover:text-white"
      } ${className}`}
    >
      {isActive ? `→ ${label}` : label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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
          <nav className="space-y-3">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={pathname === item.href}
                onClick={() => setIsOpen(false)}
                className="text-base"
              />
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-neutral-900 flex flex-col gap-6">
          {/* Theme Switcher Controls */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-semibold">Theme Mode</span>
            <ThemeToggle size="md" />
          </div>

          {/* Contact */}
          <div className="space-y-1 text-xs text-neutral-500">
            <p className="leading-tight">Need an IT expert?</p>
            <a
              href="mailto:lanceachacoso01@gmail.com"
              className="text-neutral-300 hover:text-white underline underline-offset-2 block transition-colors truncate"
            >
              lanceachacoso01@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP FIXED SIDEBAR (>= 1024px) ================= */}
      <aside className="hidden lg:flex fixed top-0 left-0 z-50 w-56 h-screen border-r border-neutral-800/80 bg-black text-white font-mono flex-col justify-between p-6 select-none overflow-y-auto transition-colors">
        {/* Top Header & Nav */}
        <div className="space-y-9">
          <div>
            <Link
              href="/"
              className="text-base font-bold tracking-tight text-white hover:text-neutral-300 transition-colors"
            >
              Lance Achacoso
            </Link>
          </div>

          <nav className="space-y-3.5">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={pathname === item.href}
                className="text-sm"
              />
            ))}
          </nav>
        </div>

        {/* Bottom Footer: Theme Switcher & Contact */}
        <div className="space-y-4 pt-4 border-t border-neutral-900 text-[11px]">
          <ThemeToggle />

          <div className="space-y-1 text-neutral-500">
            <p className="leading-tight">Need an IT expert?</p>
            <a
              href="mailto:lanceachacoso01@gmail.com"
              className="text-neutral-300 hover:text-white underline underline-offset-2 block transition-colors truncate"
            >
              lanceachacoso01@gmail.com
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
