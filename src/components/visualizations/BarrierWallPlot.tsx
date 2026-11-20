// src/components/visualizations/BarrierWallPlot.tsx
"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import styles from "./BarrierWallPlot.module.css";

export function BarrierWallPlot() {
  const [hoverX, setHoverX] = useState<number>(0.45);
  const mu = 1.0;

  const width = 320;
  const height = 115;
  const padLeft = 28;
  const padRight = 12;
  const padTop = 12;
  const padBottom = 18;

  const xMin = 0.04;
  const xMax = 2.4;
  const yMin = -3.4;
  const yMax = 1.1;

  const mapX = (x: number) =>
    padLeft + ((x - xMin) / (xMax - xMin)) * (width - padLeft - padRight);
  const mapY = (y: number) =>
    padTop + ((yMax - y) / (yMax - yMin)) * (height - padTop - padBottom);

  const pathD = useMemo(() => {
    const pts: string[] = [];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (i / steps) * (xMax - xMin);
      const y = Math.max(yMin, mu * Math.log(x));
      pts.push(`${i === 0 ? "M" : "L"} ${mapX(x).toFixed(1)} ${mapY(y).toFixed(1)}`);
    }
    return pts.join(" ");
  }, []);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * width;
    const domainX =
      xMin + ((relX - padLeft) / (width - padLeft - padRight)) * (xMax - xMin);
    setHoverX(Math.min(xMax, Math.max(xMin, domainX)));
  };

  const currentY = mu * Math.log(hoverX);
  const clampedY = Math.max(yMin, currentY);
  const pxX = mapX(hoverX);
  const pxY = mapY(clampedY);
  const zeroY = mapY(0);

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <span>Barrera: φ(x) = μ·ln(x)</span>
        <span className={`${styles.readout} tabular-nums`}>
          x={hoverX.toFixed(2)} → {currentY.toFixed(2)}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={styles.svg}
        onMouseMove={handleMouseMove}
      >
        {/* Pared de Barrera en x = 0 */}
        <line
          x1={padLeft - 4}
          y1={padTop}
          x2={padLeft - 4}
          y2={height - padBottom}
          stroke="#F43F5E"
          strokeWidth={2}
          strokeDasharray="3 3"
        />
        <text
          x={padLeft + 2}
          y={height - 6}
          fill="#F43F5E"
          fontSize="9"
          fontFamily="var(--font-mono)"
        >
          x → 0⁺ (-∞)
        </text>

        {/* Eje y = 0 */}
        <line
          x1={padLeft}
          y1={zeroY}
          x2={width - padRight}
          y2={zeroY}
          stroke="rgba(148, 163, 184, 0.2)"
          strokeWidth={1}
        />

        {/* Curva logarítmica */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="#00E5FF"
          strokeWidth={2.2}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />

        {/* Línea guía vertical del cursor */}
        <line
          x1={pxX}
          y1={padTop}
          x2={pxX}
          y2={height - padBottom}
          stroke="rgba(0, 229, 255, 0.25)"
          strokeWidth={1}
        />

        {/* Punto interactivo */}
        <circle
          cx={pxX}
          cy={pxY}
          r={4.5}
          fill={hoverX < 0.22 ? "#F43F5E" : "#00E5FF"}
        />
      </svg>
    </div>
  );
}