import { NavBar } from "@/components/nav-bar";
import { Hero } from "@/components/hero";
import { BentoGrid } from "@/components/bento-grid";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { CtaFooter } from "@/components/cta-footer";

export default function Home() {
  return (
    <main className="w-full pb-10">
      <NavBar />
      <Hero />
      <BentoGrid />
      <ExperienceTimeline />
      <CtaFooter />
    </main>
  );
}
