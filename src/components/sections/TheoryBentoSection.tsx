// src/components/sections/TheoryBentoSection.tsx
"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { InlineMath } from "react-katex";
import { SectionShell } from "@/components/ui/SectionShell";
import { MathBlock } from "@/components/ui/MathBlock";
import { MathTermTooltip } from "@/components/ui/MathTermTooltip";
import { BarrierWallPlot } from "@/components/visualizations/BarrierWallPlot";
import styles from "./TheoryBentoSection.module.css";

function SpotlightCard({ children }: { children: React.ReactNode }) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <motion.article
      className={styles.card}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.article>
  );
}

export function TheoryBentoSection() {
  const [proofOpen, setProofOpen] = useState(false);

  return (
    <SectionShell
      id="propiedades"
      sectionNumber="01"
      kicker="FUNDAMENTOS MATEMÁTICOS"
      title="Propiedades de la Trayectoria Central"
      subtitle="Garantías topológicas y de convexidad estricta que aseguran la existencia y unicidad de la ruta hacia el óptimo dentro del interior factible."
    >
      <div className={styles.bentoGrid}>
        {/* Tarjeta 1: Trayectoria Central y Función Barrera */}
        <SpotlightCard>
          <div>
            <div className={styles.cardHeader}>
              <span className={styles.cardTag}>DEFINICIÓN 01</span>
            </div>
            <h3 className={styles.cardTitle}>Trayectoria Central y Función Barrera</h3>
            <p className={styles.cardBody}>
              Sea <InlineMath math={String.raw`P = \{x \in \mathbb{R}^n : Ax \le b\}`} /> un{" "}
              <MathTermTooltip termKey="politopo">poliedro convexo</MathTermTooltip> y{" "}
              <InlineMath math={String.raw`f(x) = c^T x`} /> la función objetivo. Introducimos una{" "}
              <MathTermTooltip termKey="barrera">barrera logarítmica</MathTermTooltip> controlada por
              el parámetro <InlineMath math={String.raw`\mu > 0`} /> que penaliza la cercanía a las
              fronteras:
            </p>
            <MathBlock
              compact
              latex={String.raw`\max f_\mu(x) = c^T x + \mu \sum_{i=1}^{m} \ln(b_i - a_i^T x)`}
            />
          </div>

          <BarrierWallPlot />
        </SpotlightCard>

        {/* Tarjeta 2: Existencia de la Solución */}
        <SpotlightCard>
          <div>
            <div className={styles.cardHeader}>
              <span className={styles.cardTag}>TEOREMA 02 • EXISTENCIA</span>
            </div>
            <h3 className={styles.cardTitle}>Existencia de la Solución</h3>
            <p className={styles.cardBody}>
              Si <InlineMath math="P" /> es un conjunto cerrado y acotado (compacto), la función
              barrera <InlineMath math={String.raw`f_\mu(x)`} /> está bien definida en todo el
              interior <InlineMath math={String.raw`\text{int}(P)`} /> y tiende a{" "}
              <InlineMath math={String.raw`-\infty`} /> en la frontera{" "}
              <InlineMath math={String.raw`\partial P`} />. Por el{" "}
              <MathTermTooltip termKey="weierstrass">teorema de Weierstrass</MathTermTooltip>,
              alcanza su máximo global estrictamente dentro del interior:
            </p>
            <MathBlock
              compact
              latex={String.raw`\exists \, x^* \in \text{int}(P) : f_\mu(x^*) \ge f_\mu(x_0) \quad \forall x_0 \in P`}
            />
          </div>

          <p className={styles.proofNote}>
            El campo repulsivo en <InlineMath math={String.raw`\partial P`} /> permite restringir la
            búsqueda a una vecindad compacta interna sin perder el máximo global.
          </p>
        </SpotlightCard>

        {/* Tarjeta 3: Unicidad por Concavidad Estricta */}
        <SpotlightCard>
          <div>
            <div className={styles.cardHeader}>
              <span className={styles.cardTag}>TEOREMA 03 • UNICIDAD</span>
            </div>
            <h3 className={styles.cardTitle}>Unicidad por Concavidad Estricta</h3>
            <p className={styles.cardBody}>
              Dado que <InlineMath math={String.raw`\ln(\cdot)`} /> es estrictamente cóncavo,{" "}
              <InlineMath math={String.raw`f_\mu(x)`} /> también lo es. Si existieran dos óptimos
              distintos <InlineMath math={String.raw`x \neq y`} />, entonces{" "}
              <InlineMath math={String.raw`A(y - x) = 0`} />, lo que implicaría que toda la recta{" "}
              <InlineMath math={String.raw`\{x + s(y - x) : s \in \mathbb{R}\}`} /> reside dentro de{" "}
              <InlineMath math="P" />, contradiciendo que <InlineMath math="P" /> es acotado.
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setProofOpen((prev) => !prev)}
              className={styles.accordionBtn}
              aria-expanded={proofOpen}
            >
              <span>Ver demostración paso a paso</span>
              <motion.span
                animate={{ rotate: proofOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: "inline-flex" }}
              >
                <ChevronDown size={15} strokeWidth={1.5} />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {proofOpen && (
                <motion.div
                  className={styles.accordionBody}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                >
                  <MathBlock
                    compact
                    latex={String.raw`Ax = Ay \implies A(y - x) = 0 \implies A(x + s(y - x)) = Ax`}
                  />
                  <p className={styles.proofNote}>
                    Como <InlineMath math="P" /> es acotado, no contiene rectas completas; por tanto,{" "}
                    <InlineMath math="x = y" /> necesariamente.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SpotlightCard>
      </div>
    </SectionShell>
  );
}