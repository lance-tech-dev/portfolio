"use client";

import { useState } from "react";
import { personalInfo, navLinks } from "@/app/data";
import { Menu, X } from "lucide-react";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Sticky Bar */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-black/90 backdrop-blur-md border-b border-neutral-800">
        <span className="font-mono text-sm font-semibold tracking-wide text-white">
          {personalInfo.name}
        </span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 text-neutral-400 hover:text-white transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-[57px] z-30 bg-black px-8 py-10 flex flex-col justify-between border-t border-neutral-800">
          <nav className="space-y-4 font-mono text-sm">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-neutral-400 hover:text-white transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="text-xs font-mono text-neutral-500 pt-8 border-t border-neutral-800">
            <p>For work & collabs:</p>
            <a
              href="mailto:lanceachacoso01@gmail.com"
              className="text-neutral-300 underline underline-offset-4"
            >
              reach out via email
            </a>
          </div>
        </div>
      )}

      {/* Desktop Fixed Left Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-60 flex-col justify-between p-8 border-r border-neutral-800 bg-black font-mono text-xs text-neutral-400 z-30">
        <div className="space-y-8">
          <div className="text-white font-semibold text-sm tracking-wide">
            {personalInfo.name}
          </div>

          <nav className="space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="space-y-2 pt-6 border-t border-neutral-800 text-[11px] text-neutral-500">
          <p>For work, collabs & everything else:</p>
          <a
            href="mailto:lanceachacoso01@gmail.com"
            className="block text-neutral-300 hover:text-white transition-colors underline underline-offset-4"
          >
            lanceachacoso01@gmail.com
          </a>
        </div>
      </aside>
    </>
  );
}