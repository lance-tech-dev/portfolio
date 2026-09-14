import { Sidebar } from "@/components/sidebar";
import { SiteFooter } from "@/components/site-footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-x-hidden flex flex-col lg:flex-row">
      {/* Navigation Sidebar / Mobile Header */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="w-full lg:ml-56 lg:w-[calc(100%-14rem)] min-h-screen px-6 sm:px-8 lg:px-12 pt-20 pb-12 lg:py-12 min-w-0 overflow-x-hidden flex-1 flex justify-center">
        <div className="w-full max-w-4xl flex flex-col">
          <div className="space-y-16">{children}</div>
          <SiteFooter />
        </div>
      </main>
    </div>
  );
}
