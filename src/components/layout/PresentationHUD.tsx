// src/components/layout/PresentationHUD.tsx
"use client";

import React from "react";
import { ArrowUp, Presentation } from "lucide-react";
import styles from "./PresentationHUD.module.css";

interface PresentationHUDProps {
  isPresentationMode: boolean;
  onTogglePresentation: () => void;
}

export function PresentationHUD({
  isPresentationMode,
  onTogglePresentation,
}: PresentationHUDProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.hudWrapper}>
      <button
        type="button"
        onClick={onTogglePresentation}
        className={`${styles.badge} ${isPresentationMode ? styles.badgeActive : ""}`}
        title="Alternar Modo Proyector en Aula"
      >
        {isPresentationMode ? (
          <>
            <span className={styles.dot} />
            <span>MODO AULA ACTIVO</span>
            <span className={styles.kbd}>ESC</span>
          </>
        ) : (
          <>
            <Presentation size={13} strokeWidth={1.5} />
            <span>Proyector</span>
            <span className={styles.kbd}>F</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={scrollToTop}
        className={styles.iconBtn}
        title="Volver al inicio"
        aria-label="Volver al inicio"
      >
        <ArrowUp size={15} strokeWidth={1.5} />
      </button>
    </div>
  );
}