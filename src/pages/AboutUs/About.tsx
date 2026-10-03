// src/pages/About.tsx
import AboutHero from "@/components/layout/AboutLayout/AboutHero";
import TeamSection from "@/components/layout/AboutLayout/TeamSection";
import TrustMetricsSection from "@/components/layout/AboutLayout/TrustMetricsSection";
import OurStorySection from "@/components/layout/AboutLayout/OurStorySection";
import CoreValuesSection from "@/components/layout/AboutLayout/CoreValuesSection";
import MilestoneSection from "@/components/layout/AboutLayout/MilestoneSection";
import FinalCTASection from "@/components/layout/AboutLayout/FinalCTASection";

export default function About() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <AboutHero />
      <TeamSection />
      <TrustMetricsSection />
      <OurStorySection />
      <CoreValuesSection />
      <MilestoneSection />
      <FinalCTASection />
    </main>
  );
}