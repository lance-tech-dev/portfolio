import { Sidebar } from "@/components/sidebar";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar />
      <main className="lg:pl-60">
        <div className="max-w-4xl mx-auto px-6 py-10 md:py-16">
          <Hero />
        </div>
      </main>
    </div>
  );
}