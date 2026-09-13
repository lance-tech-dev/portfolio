import { Sidebar } from "@/components/sidebar";
import { Hero } from "@/components/hero";
import { ProjectsSection } from "@/components/projects-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-x-hidden flex flex-col lg:flex-row">
      {/* Navigation Sidebar / Mobile Header */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="w-full lg:ml-64 lg:w-[calc(100%-16rem)] min-h-screen px-6 sm:px-8 lg:px-12 pt-20 pb-12 lg:py-12 min-w-0 overflow-x-hidden flex-1 flex justify-center">
        <div className="w-full max-w-4xl space-y-16">
          <Hero />
          <ProjectsSection />
        </div>
      </main>
    </div>
  );
}