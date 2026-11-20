// src/components/sections/PrimalDualEngineSection.tsx
"use client";

import React from "react";
import { SectionShell } from "@/components/ui/SectionShell";
import { KktFlowDiagram } from "@/components/visualizations/KktFlowDiagram";

export function PrimalDualEngineSection() {
  return (
    <SectionShell
      id="motor-primal-dual"
      sectionNumber="02"
      kicker="FORMULACIÓN ALGORÍTMICA"
      title="De Lagrange al Paso de Newton"
      subtitle="Inspecciona cada etapa de la arquitectura Primal-Dual: desde las condiciones KKT perturbadas con matrices diagonales hasta la reducción de la brecha de dualidad."
    >
      <KktFlowDiagram />
    </SectionShell>
  );
}