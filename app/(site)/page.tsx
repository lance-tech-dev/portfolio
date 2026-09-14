import { Suspense } from "react";
import { Hero } from "@/components/hero";
import { ProjectsSection } from "@/components/projects-section";
import { ProjectsSkeleton } from "@/components/projects-skeleton";
import { ExperienceSection } from "@/components/experience-section";
import { ExperienceSkeleton } from "@/components/experience-skeleton";
import { StackSection } from "@/components/stack-section";
import { StackSkeleton } from "@/components/stack-skeleton";
import { CertificationsSection } from "@/components/certifications-section";
import { CertificationsSkeleton } from "@/components/certifications-skeleton";

export default function Home() {
  return (
    <>
      <Hero />
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsSection />
      </Suspense>
      <Suspense fallback={<ExperienceSkeleton />}>
        <ExperienceSection />
      </Suspense>
      <Suspense fallback={<StackSkeleton />}>
        <StackSection />
      </Suspense>
      <Suspense fallback={<CertificationsSkeleton />}>
        <CertificationsSection />
      </Suspense>
    </>
  );
}
