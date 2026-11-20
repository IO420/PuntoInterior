// src/components/ui/MagneticButton.tsx
"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "./MagneticButton.module.css";

interface MagneticButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}

export function MagneticButton({
  children,
  variant = "primary",
  onClick,
  className = "",
  type = "button",
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.22;
    const deltaY = (e.clientY - centerY) * 0.22;
    setOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 320, damping: 20, mass: 0.4 }}
      whileTap={{ scale: 0.97 }}
      className={`${styles.button} ${styles[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}