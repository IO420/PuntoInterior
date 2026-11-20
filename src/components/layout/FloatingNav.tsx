// src/components/layout/FloatingNav.tsx
"use client";

import React, { useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Monitor, Minimize2 } from "lucide-react";
import { NAV_ITEMS } from "@/core/data/presentationCopy";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import styles from "./FloatingNav.module.css";

interface FloatingNavProps {
  isPresentationMode: boolean;
  onTogglePresentation: () => void;
}

export function FloatingNav({
  isPresentationMode,
  onTogglePresentation,
}: FloatingNavProps) {
  const [revealInPresentation, setRevealInPresentation] = useState(false);
  const activeId = useScrollSpy(NAV_ITEMS.map((item) => item.id));

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const shouldHide = isPresentationMode && !revealInPresentation;

  return (
    <>
      <motion.div className={styles.progressBar} style={{ scaleX }} />

      {isPresentationMode && (
        <div
          className={styles.hoverTriggerZone}
          onMouseEnter={() => setRevealInPresentation(true)}
        />
      )}

      <nav
        className={`${styles.navContainer} ${shouldHide ? styles.hiddenPresentation : ""}`}
        onMouseLeave={() => setRevealInPresentation(false)}
        aria-label="Navegación de secciones"
      >
        <div className={styles.pillBar}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavPill"
                    className={styles.activePillBg}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={styles.navNumber}>{item.number}.</span>
                <span className={styles.navLabel}>{item.label}</span>
              </button>
            );
          })}

          <div className={styles.divider} />

          <button
            type="button"
            onClick={onTogglePresentation}
            className={`${styles.projectorBtn} ${
              isPresentationMode ? styles.projectorBtnActive : ""
            }`}
            title={
              isPresentationMode
                ? "Salir de Modo Proyector (F / Esc)"
                : "Activar Modo Proyector en Aula (Tecla F)"
            }
            aria-label="Alternar modo proyector"
          >
            {isPresentationMode ? (
              <Minimize2 size={15} strokeWidth={1.5} />
            ) : (
              <Monitor size={15} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </nav>
    </>
  );
}