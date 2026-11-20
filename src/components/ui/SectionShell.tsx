// src/components/ui/SectionShell.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./SectionShell.module.css";

interface SectionShellProps {
  id: string;
  sectionNumber: string;
  kicker: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showDivider?: boolean;
}

export function SectionShell({
  id,
  sectionNumber,
  kicker,
  title,
  subtitle,
  children,
  showDivider = true,
}: SectionShellProps) {
  return (
    <>
      <section id={id} className={styles.section}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.kickerRow}>
            <span>{sectionNumber} / {kicker}</span>
            <span className={styles.kickerLine} />
          </div>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </motion.div>

        {children}
      </section>
      {showDivider && <div className={styles.divider} />}
    </>
  );
}