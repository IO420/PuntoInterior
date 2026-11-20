"use client";

import React from "react";
import { usePresentationMode } from "@/hooks/usePresentationMode";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { PresentationHUD } from "@/components/layout/PresentationHUD";
import { HeroSection } from "@/components/sections/HeroSection";
import { TheoryBentoSection } from "@/components/sections/TheoryBentoSection";
import { PrimalDualEngineSection } from "@/components/sections/PrimalDualEngineSection";
import { NumericalLabSection } from "@/components/sections/NumericalLabSection";
import { ApplicationsConclusionSection } from "@/components/sections/ApplicationsConclusionSection";

export default function HomePage() {
  const { isPresentationMode, togglePresentationMode } = usePresentationMode();

  return (
    <main>
      <FloatingNav
        isPresentationMode={isPresentationMode}
        onTogglePresentation={togglePresentationMode}
      />

      <HeroSection />
      <TheoryBentoSection />
      <PrimalDualEngineSection />
      <NumericalLabSection />
      <ApplicationsConclusionSection />

      <PresentationHUD
        isPresentationMode={isPresentationMode}
        onTogglePresentation={togglePresentationMode}
      />
    </main>
  );
}