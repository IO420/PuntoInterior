// src/components/ui/MathBlock.tsx
"use client";

import { useState } from "react";
import { BlockMath } from "react-katex";
import { Check, Copy } from "lucide-react";
import styles from "./MathBlock.module.css";

interface MathBlockProps {
  latex: string;
  compact?: boolean;
  className?: string;
}

export function MathBlock({ latex, compact = false, className = "" }: MathBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(latex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback silencioso
    }
  };

  return (
    <div className={`${styles.wrapper} ${compact ? styles.compact : ""} ${className}`}>
      <button
        type="button"
        onClick={handleCopy}
        className={`${styles.copyButton} ${copied ? styles.copied : ""}`}
        aria-label="Copiar código LaTeX"
        title="Copiar fuente LaTeX"
      >
        {copied ? (
          <>
            <span>¡Copiado!</span>
            <Check size={12} strokeWidth={1.5} />
          </>
        ) : (
          <>
            <span>Copiar LaTeX</span>
            <Copy size={12} strokeWidth={1.5} />
          </>
        )}
      </button>
      <BlockMath math={latex} />
    </div>
  );
}