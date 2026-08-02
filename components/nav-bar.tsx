import { ThemeToggle } from "@/components/theme-toggle";

export function NavBar() {
  return (
    <nav className="flex justify-between items-center mb-16 md:mb-24">
      <div className="font-bold text-xl tracking-tighter text-zinc-900 dark:text-zinc-100">
        LA<span className="text-emerald-500">.</span>
      </div>
      <ThemeToggle />
    </nav>
  );
}
