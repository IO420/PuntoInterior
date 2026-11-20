// src/components/sections/HeroSection.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, RotateCcw } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { MathTermTooltip } from "@/components/ui/MathTermTooltip";
import { HeroPolytopeCanvas } from "@/components/visualizations/HeroPolytopeCanvas";
import styles from "./HeroSection.module.css";

export function HeroSection() {
  const [restartTrigger, setRestartTrigger] = useState(0);

  const handleExploreClick = () => {
    const labEl = document.getElementById("laboratorio");
    if (labEl) {
      labEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <section id="introduccion" className={styles.heroSection}>
        <motion.div
          className={styles.leftCol}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.topBadge}>
            <span className={styles.badgePulse} />
            <span>OPTIMIZACIÓN I • MÉTODOS DE PUNTO INTERIOR</span>
          </div>

          <h1 className={styles.title}>
            Navegando el <span className={styles.gradientWord}>Interior</span> del Politopo.
          </h1>

          <p className={styles.subtitle}>
            A diferencia del método Simplex que recorre aristas de vértice en vértice, los
            algoritmos de Punto Interior atraviesan el corazón de la región factible siguiendo la{" "}
            <MathTermTooltip termKey="trayectoriaCentral">Trayectoria Central</MathTermTooltip>{" "}
            hacia el óptimo global.
          </p>

          <div className={styles.ctaGroup}>
            <MagneticButton variant="primary" onClick={handleExploreClick}>
              <span>Explorar Laboratorio Interactivo</span>
              <ArrowDown size={16} strokeWidth={1.5} />
            </MagneticButton>

            <MagneticButton
              variant="secondary"
              onClick={() => setRestartTrigger((prev) => prev + 1)}
            >
              <RotateCcw size={15} strokeWidth={1.5} />
              <span>Simular Carrera Simplex vs. IPM</span>
            </MagneticButton>
          </div>

          <div className={styles.academicMeta}>
            <div className={styles.metaRow}>
              Exposición para el{" "}
              <span className={styles.metaHighlight}>Prof. José Alberto Meléndez Piña</span>
            </div>
            <div className={styles.metaRow}>
              Referencia Base:{" "}
              <span className={styles.metaHighlight}>
                Karmarkar (1984) &amp; Lopez Lauterio, Thakur, Shenoy
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.rightCol}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <HeroPolytopeCanvas restartTrigger={restartTrigger} />
        </motion.div>
      </section>
      <div className={styles.divider} />
    </>
  );
}