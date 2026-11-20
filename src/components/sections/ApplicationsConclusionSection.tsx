// src/components/sections/ApplicationsConclusionSection.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { GitBranch, ScanLine, Waves, Zap } from "lucide-react";
import {
  COMPARISON_ROWS,
  ENGINEERING_APPLICATIONS,
} from "@/core/data/presentationCopy";
import { SectionShell } from "@/components/ui/SectionShell";
import styles from "./ApplicationsConclusionSection.module.css";

const ICON_MAP = {
  Zap: Zap,
  Waves: Waves,
  ScanLine: ScanLine,
  GitBranch: GitBranch,
};

export function ApplicationsConclusionSection() {
  return (
    <SectionShell
      id="aplicaciones"
      sectionNumber="04"
      kicker="IMPACTO EN INGENIERÍA"
      title="Aplicaciones Reales y Conclusión"
      subtitle="Desde el despacho energético en tiempo real hasta la reconstrucción inversa de imágenes y mecánica computacional de fracturas."
      showDivider={false}
    >
      {/* Grid de 4 Tarjetas de Aplicaciones */}
      <div className={styles.appsGrid}>
        {ENGINEERING_APPLICATIONS.map((app, idx) => {
          const IconComponent = ICON_MAP[app.iconName];
          return (
            <motion.article
              key={app.id}
              className={styles.appCard}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.45,
                delay: idx * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div>
                <div className={styles.iconBox}>
                  <IconComponent size={20} strokeWidth={1.5} />
                </div>
                <span className={styles.domainTag}>{app.domain}</span>
                <h3 className={styles.appTitle}>{app.title}</h3>
                <p className={styles.appDesc}>{app.description}</p>
              </div>

              <span className={styles.metricPill}>{app.metricBadge}</span>
            </motion.article>
          );
        })}
      </div>

      {/* Tabla Comparativa Final */}
      <div className={styles.comparisonBox}>
        <div className={styles.compHeader}>
          <h3 className={styles.compTitle}>
            Síntesis Comparativa: Método Simplex vs. Punto Interior (PDIP)
          </h3>
          <p className={styles.compSubtitle}>
            Contraste estructural y computacional en optimización lineal y convexa de gran escala.
          </p>
        </div>

        <table className={styles.compTable}>
          <thead>
            <tr>
              <th>Criterio</th>
              <th>Método Simplex</th>
              <th>Punto Interior (PDIP)</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.criterion}>
                <td className={styles.criterionCell}>{row.criterion}</td>
                <td className={styles.simplexCell}>{row.simplex}</td>
                <td className={styles.ipmCell}>{row.interiorPoint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className={styles.footerNote}>
        Laboratorio Interactivo de Métodos de Punto Interior • Optimización I • Exposición Académica
      </footer>
    </SectionShell>
  );
}