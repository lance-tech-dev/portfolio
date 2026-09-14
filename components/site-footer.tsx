"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <footer className="mt-16 pt-6 border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-500 font-mono">
      <span>© {new Date().getFullYear()} Lance Achacoso</span>
      {!isHome && (
        <Link href="/" className="hover:text-white transition-colors">
          ← back to site
        </Link>
      )}
    </footer>
  );
}
