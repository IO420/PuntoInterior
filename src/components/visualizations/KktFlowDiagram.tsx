// src/components/visualizations/KktFlowDiagram.tsx
"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { KKT_FLOW_NODES } from "@/core/data/presentationCopy";
import { generateSampleNewtonTrace } from "@/core/math/newtonStep";
import { MathBlock } from "@/components/ui/MathBlock";
import styles from "./KktFlowDiagram.module.css";

export function KktFlowDiagram() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeNode = KKT_FLOW_NODES[activeIndex];
  const newtonTrace = useMemo(() => generateSampleNewtonTrace(1e-6), []);

  return (
    <div className={styles.container}>
      {/* Arquitectura Horizontal de 4 Nodos */}
      <div className={styles.pipelineWrapper}>
        <svg className={styles.connectorLayer} viewBox="0 0 1000 24" preserveAspectRatio="none">
          <line x1="0" y1="12" x2="1000" y2="12" className={styles.flowLine} />
        </svg>

        <div className={styles.nodesGrid}>
          {KKT_FLOW_NODES.map((node, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`${styles.nodeCard} ${isActive ? styles.nodeCardActive : ""}`}
              >
                <span className={styles.stepBadge}>{node.stepNumber}</span>
                <span className={styles.nodeTitle}>{node.shortLabel}</span>
                <span className={styles.nodeHint}>
                  {isActive ? "Inspeccionando matrices" : "Clic para inspeccionar"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel Visor Matricial Inferior */}
      <div className={styles.detailPanel}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNode.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.detailHeader}>
              <h3 className={styles.detailTitle}>{activeNode.title}</h3>
              <span className={styles.detailStepTag}>{activeNode.stepNumber} / 04</span>
            </div>

            <p className={styles.detailDesc}>{activeNode.description}</p>

            <MathBlock latex={activeNode.latexPrimary} />
            {activeNode.latexSecondary && (
              <MathBlock latex={activeNode.latexSecondary} compact />
            )}

            <div className={styles.footerMeta}>
              <div className={styles.metaBox}>
                <span className={styles.metaLabel}>Dimensiones y Estructura</span>
                <p className={styles.metaText}>{activeNode.matrixNote}</p>
              </div>
              <div className={styles.metaBox}>
                <span className={styles.metaLabel}>Propiedad Clave</span>
                <p className={styles.metaText}>{activeNode.keyInsight}</p>
              </div>
            </div>

            {/* Tabla de traza de Newton en el Paso 04 */}
            {activeNode.id === "newton-step" && (
              <div className={styles.traceMiniTable}>
                <table className={`${styles.traceTable} tabular-nums`}>
                  <thead>
                    <tr>
                      <th>Iteración k</th>
                      <th>Residual Primal ||r_p||</th>
                      <th>Residual Dual ||r_d||</th>
                      <th>Brecha Dualidad xᵀs</th>
                      <th>Paso α_p</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newtonTrace.map((row, idx) => {
                      const isLast = idx === newtonTrace.length - 1;
                      return (
                        <tr key={row.iteration} className={isLast ? styles.convergedRow : ""}>
                          <td>k = {row.iteration}</td>
                          <td>{row.primalResidualNorm.toExponential(2)}</td>
                          <td>{row.dualResidualNorm.toExponential(2)}</td>
                          <td>{row.dualityGap.toExponential(2)}</td>
                          <td>{row.alphaPrimal.toFixed(3)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}