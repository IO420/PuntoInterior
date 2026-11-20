// src/components/sections/NumericalLabSection.tsx
"use client";

import React from "react";
import { InlineMath } from "react-katex";
import { SectionShell } from "@/components/ui/SectionShell";
import { MathBlock } from "@/components/ui/MathBlock";
import { CentralPathLab } from "@/components/visualizations/CentralPathLab";
import styles from "./NumericalLabSection.module.css";

export function NumericalLabSection() {
  return (
    <SectionShell
      id="laboratorio"
      sectionNumber="03"
      kicker="DEMOSTRACIÓN EN VIVO"
      title="Simulador de Trayectoria Central"
      subtitle="Manipula el parámetro de barrera μ en tiempo real para observar cómo las curvas de nivel comprimen la solución desde el centro analítico hasta el vértice óptimo (2, 2)."
    >
      {/* Banner Fijo del Planteamiento */}
      <div className={styles.problemBanner}>
        <span className={styles.bannerTag}>Modelo Lineal Canónico (2D)</span>
        <InlineMath
          math={String.raw`\max \; 3x_1 + 3x_2 \quad \text{sujeto a:} \quad x_1 + x_2 \le 4, \quad x_1 \ge 0, \quad x_2 \ge 0`}
        />
      </div>

      {/* Dos columnas: 45% Derivación Analítica / 55% Simulador Sticky */}
      <div className={styles.splitGrid}>
        <div className={styles.derivationCol}>
          <div className={styles.stepCard}>
            <div className={styles.stepHeader}>
              <span className={styles.stepPill}>01</span>
              <h3 className={styles.stepTitle}>Función Penalizada</h3>
            </div>
            <p className={styles.stepText}>
              Incorporamos las tres restricciones lineales mediante sus holguras dentro de la
              barrera logarítmica con parámetro <InlineMath math={String.raw`\mu > 0`} />:
            </p>
            <MathBlock
              compact
              latex={String.raw`P(x_1, x_2, \mu) = 3x_1 + 3x_2 + \mu\big[\ln(4 - x_1 - x_2) + \ln(x_1) + \ln(x_2)\big]`}
            />
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepHeader}>
              <span className={styles.stepPill}>02</span>
              <h3 className={styles.stepTitle}>
                Condiciones de Primer Orden (<InlineMath math={String.raw`\nabla P = 0`} />)
              </h3>
            </div>
            <p className={styles.stepText}>
              Al ser <InlineMath math="P" /> estrictamente cóncava en el interior del triángulo
              factible, el máximo único satisface la anulación del gradiente:
            </p>
            <MathBlock
              compact
              latex={String.raw`\frac{\partial P}{\partial x_1} = 3 - \frac{\mu}{4 - x_1 - x_2} + \frac{\mu}{x_1} = 0, \qquad \frac{\partial P}{\partial x_2} = 3 - \frac{\mu}{4 - x_1 - x_2} + \frac{\mu}{x_2} = 0`}
            />
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepHeader}>
              <span className={styles.stepPill}>03</span>
              <h3 className={styles.stepTitle}>
                Solución Exacta por Simetría (<InlineMath math="x_1 = x_2" />)
              </h3>
            </div>
            <p className={styles.stepText}>
              Por simetría del sistema se deduce <InlineMath math="x_1 = x_2" />, reduciendo el
              sistema a la ecuación cuadrática{" "}
              <InlineMath math={String.raw`6x_1^2 - 3x_1(4 - \mu) - 4\mu = 0`} /> cuya raíz positiva
              genera la curva exacta:
            </p>
            <MathBlock
              compact
              latex={String.raw`x_1(\mu) = x_2(\mu) = \frac{3(4 - \mu) + \sqrt{9(4 - \mu)^2 + 96\mu}}{12}`}
            />
          </div>
        </div>

        <div className={styles.stickyLabCol}>
          <CentralPathLab />
        </div>
      </div>
    </SectionShell>
  );
}