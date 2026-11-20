// src/components/ui/MathTermTooltip.tsx
"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GLOSSARY_TERMS } from "@/core/data/presentationCopy";
import styles from "./MathTermTooltip.module.css";

interface MathTermTooltipProps {
  termKey: keyof typeof GLOSSARY_TERMS;
  children: React.ReactNode;
}

export function MathTermTooltip({ termKey, children }: MathTermTooltipProps) {
  const [open, setOpen] = useState(false);
  const entry = GLOSSARY_TERMS[termKey];

  if (!entry) return <>{children}</>;

  return (
    <span
      className={styles.trigger}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            className={styles.popover}
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            role="tooltip"
          >
            <span className={styles.popoverTitle}>{entry.title}</span>
            <span className={styles.popoverBody}>{entry.definition}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}