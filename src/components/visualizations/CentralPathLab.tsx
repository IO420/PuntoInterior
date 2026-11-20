// src/components/visualizations/CentralPathLab.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  findClosestPresetIndex,
  getConvergenceTableData,
  MU_PRESETS,
  solveCentralPathPoint,
} from "@/core/math/barrierSolver";
import {
  ANALYTIC_CENTER,
  computeBarrierContours,
  OPTIMAL_VERTEX,
  sampleCentralPathCurve,
} from "@/core/math/polytopeGeometry";
import { useCanvasSetup } from "@/hooks/useCanvasSetup";
import styles from "./CentralPathLab.module.css";

/**
 * Mapeo continuo del slider [0 .. 1000] a μ:
 * 0 -> μ = 1000 (10^3)
 * 980 -> μ = 0.001 (10^-3)
 * 1000 -> μ = 0 (Óptimo exacto)
 */
function sliderToMu(pos: number): number {
  if (pos >= 992) return 0;
  const clamped = Math.min(980, Math.max(0, pos));
  const t = clamped / 980;
  const logMu = 3 * (1 - t) + -3 * t;
  return Math.pow(10, logMu);
}

function muToSlider(mu: number): number {
  if (mu <= 0.0005) return 1000;
  const logMu = Math.min(3, Math.max(-3, Math.log10(mu)));
  const t = (3 - logMu) / 6;
  return Math.round(t * 980);
}

export function CentralPathLab() {
  // Inicia en μ = 1 (posición intermedia didáctica)
  const [sliderPos, setSliderPos] = useState<number>(() => muToSlider(1));
  const animRef = useRef<number | null>(null);

  const mu = useMemo(() => sliderToMu(sliderPos), [sliderPos]);
  const state = useMemo(() => solveCentralPathPoint(mu), [mu]);
  const tableData = useMemo(() => getConvergenceTableData(), []);
  const centralCurve = useMemo(() => sampleCentralPathCurve(70), []);
  const closestRowIdx = useMemo(() => findClosestPresetIndex(mu), [mu]);

  const contours = useMemo(
    () => computeBarrierContours(mu, state.barrierValue, 52),
    [mu, state.barrierValue]
  );

  const { containerRef, canvasRef, dimensions } = useCanvasSetup();

  // Animación suave al pulsar un botón preset
  const animateToMu = (targetMu: number) => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const startPos = sliderPos;
    const endPos = muToSlider(targetMu);
    const duration = 480;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setSliderPos(startPos + (endPos - startPos) * eased);
      if (t < 1) {
        animRef.current = requestAnimationFrame(step);
      }
    };

    animRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Renderizado Canvas 2D
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width: w, height: h, dpr } = dimensions;
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    // Dominio cartesiano [-0.5, 4.5] x [-0.5, 4.5] con relación de aspecto cuadrada centrada
    const pad = 42;
    const plotSize = Math.min(w - pad * 2, h - pad * 2);
    const offsetX = (w - plotSize) / 2;
    const offsetY = (h - plotSize) / 2;

    const minVal = -0.5;
    const maxVal = 4.5;
    const span = maxVal - minVal;

    const toPxX = (x1: number) => offsetX + ((x1 - minVal) / span) * plotSize;
    const toPxY = (x2: number) => offsetY + plotSize - ((x2 - minVal) / span) * plotSize;

    // 1. Cuadrícula graduada
    ctx.strokeStyle = "rgba(148, 163, 184, 0.09)";
    ctx.lineWidth = 1;
    for (let v = 0; v <= 4; v += 0.5) {
      const gx = toPxX(v);
      const gy = toPxY(v);
      ctx.beginPath();
      ctx.moveTo(gx, offsetY);
      ctx.lineTo(gx, offsetY + plotSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(offsetX, gy);
      ctx.lineTo(offsetX + plotSize, gy);
      ctx.stroke();
    }

    // 2. Ejes principales x1 y x2
    const originX = toPxX(0);
    const originY = toPxY(0);

    ctx.strokeStyle = "rgba(248, 250, 252, 0.35)";
    ctx.lineWidth = 1.4;
    // Eje x1
    ctx.beginPath();
    ctx.moveTo(offsetX, originY);
    ctx.lineTo(offsetX + plotSize, originY);
    ctx.stroke();
    // Eje x2
    ctx.beginPath();
    ctx.moveTo(originX, offsetY + plotSize);
    ctx.lineTo(originX, offsetY);
    ctx.stroke();

    // Ticks numéricos
    ctx.font = "400 11px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#64748B";
    for (let v = 1; v <= 4; v++) {
      ctx.fillText(String(v), toPxX(v) - 4, originY + 16);
      ctx.fillText(String(v), originX - 16, toPxY(v) + 4);
    }
    ctx.fillStyle = "#94A3B8";
    ctx.fillText("x₁", offsetX + plotSize - 14, originY - 8);
    ctx.fillText("x₂", originX + 8, offsetY + 12);

    // 3. Región Factible Triángulo (0,0), (4,0), (0,4)
    const p00 = { x: toPxX(0), y: toPxY(0) };
    const p40 = { x: toPxX(4), y: toPxY(0) };
    const p04 = { x: toPxX(0), y: toPxY(4) };

    ctx.beginPath();
    ctx.moveTo(p00.x, p00.y);
    ctx.lineTo(p40.x, p40.y);
    ctx.lineTo(p04.x, p04.y);
    ctx.closePath();
    ctx.fillStyle = "rgba(99, 102, 241, 0.15)";
    ctx.fill();

    // 4. Curvas de Nivel (Isocontornos) de P(x1, x2, μ)
    contours.forEach((contour, idx) => {
      const alpha = Math.max(0.14, 0.52 - idx * 0.065);
      ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
      ctx.lineWidth = idx === 0 ? 1.5 : 1.05;
      ctx.beginPath();
      contour.segments.forEach(([a, b]) => {
        ctx.moveTo(toPxX(a.x), toPxY(a.y));
        ctx.lineTo(toPxX(b.x), toPxY(b.y));
      });
      ctx.stroke();
    });

    // 5. Bordes de Barrera en Carmesí (x1 + x2 = 4, x1 = 0, x2 = 0)
    ctx.strokeStyle = "#F43F5E";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p00.x, p00.y);
    ctx.lineTo(p40.x, p40.y);
    ctx.lineTo(p04.x, p04.y);
    ctx.closePath();
    ctx.stroke();

    // Etiqueta de restricción activa x1 + x2 = 4
    ctx.save();
    const midHypX = toPxX(2.15);
    const midHypY = toPxY(2.15);
    ctx.translate(midHypX, midHypY);
    ctx.rotate(Math.PI / 4);
    ctx.font = "500 11px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#F43F5E";
    ctx.fillText("x₁ + x₂ = 4", -32, -8);
    ctx.restore();

    // 6. Trayectoria Central (línea punteada cian desde (4/3, 4/3) hasta (2, 2))
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "#00E5FF";
    ctx.lineWidth = 2;
    centralCurve.forEach((pt, idx) => {
      const px = toPxX(pt.x);
      const py = toPxY(pt.y);
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.restore();

    // Marcador Centro Analítico (4/3, 4/3)
    const acX = toPxX(ANALYTIC_CENTER.x);
    const acY = toPxY(ANALYTIC_CENTER.y);
    ctx.beginPath();
    ctx.arc(acX, acY, 3.8, 0, Math.PI * 2);
    ctx.fillStyle = "#6366F1";
    ctx.fill();
    ctx.font = "400 10px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#94A3B8";
    ctx.fillText("(4/3, 4/3)", acX - 58, acY + 14);

    // Marcador Óptimo Global (2, 2)
    const optX = toPxX(OPTIMAL_VERTEX.x);
    const optY = toPxY(OPTIMAL_VERTEX.y);
    ctx.beginPath();
    ctx.arc(optX, optY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#10B981";
    ctx.fill();

    // 7. Punto Activo (x1(μ), x2(μ))
    const activeX = toPxX(state.x1);
    const activeY = toPxY(state.x2);
    const isOptimal = mu === 0;
    const dotColor = isOptimal ? "#10B981" : "#00E5FF";

    // Halo exterior
    ctx.beginPath();
    ctx.arc(activeX, activeY, 12, 0, Math.PI * 2);
    ctx.fillStyle = isOptimal ? "rgba(16, 185, 129, 0.22)" : "rgba(0, 229, 255, 0.22)";
    ctx.fill();

    // Núcleo brillante
    ctx.beginPath();
    ctx.arc(activeX, activeY, 6, 0, Math.PI * 2);
    ctx.fillStyle = dotColor;
    ctx.shadowColor = dotColor;
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Tooltip flotante pegado al punto activo
    const coordLabel = `(${state.x1.toFixed(3)}, ${state.x2.toFixed(3)})`;
    ctx.font = "600 11px 'JetBrains Mono', monospace";
    const textMetrics = ctx.measureText(coordLabel);
    const boxW = textMetrics.width + 14;
    const boxH = 22;
    const boxX = Math.min(w - boxW - 8, activeX + 12);
    const boxY = Math.max(8, activeY - 28);

    ctx.fillStyle = "rgba(8, 11, 18, 0.92)";
    ctx.strokeStyle = dotColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 5);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#F8FAFC";
    ctx.fillText(coordLabel, boxX + 7, boxY + 15);

    ctx.restore();
  }, [dimensions, contours, centralCurve, state, mu]);

  const isOptimalReached = state.objectiveValue >= 11.999;

  return (
    <div className={styles.labContainer}>
      {/* Panel de Control Superior: Slider Logarítmico + Presets */}
      <div className={styles.controlPanel}>
        <div className={styles.sliderHeader}>
          <span className={styles.sliderLabel}>Parámetro de Barrera μ (Escala Logarítmica)</span>
          <span className={`${styles.sliderValueBadge} tabular-nums`}>
            μ = {mu === 0 ? "0 (Óptimo)" : mu >= 10 ? mu.toFixed(1) : mu.toFixed(4)}
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={1000}
          step={1}
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className={styles.rangeInput}
          aria-label="Control del parámetro de barrera mu"
        />

        <div className={styles.presetsRow}>
          <span className={styles.presetsTitle}>Hitos:</span>
          {MU_PRESETS.map((preset) => {
            const isSelected =
              (preset === 0 && mu === 0) ||
              (preset > 0 && Math.abs(mu - preset) / preset < 0.03);
            return (
              <button
                key={preset}
                type="button"
                onClick={() => animateToMu(preset)}
                className={`${styles.presetBtn} ${isSelected ? styles.presetBtnActive : ""}`}
              >
                {preset === 0 ? "μ = 0 (Óptimo)" : `μ = ${preset}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lienzo Cartesiano Interactivo */}
      <div className={styles.canvasCard}>
        <div ref={containerRef} className={styles.canvasHost}>
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* HUD de Telemetría en Vivo (4 KPIs) */}
      <div className={styles.hudGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Parámetro μ</span>
          <span className={`${styles.kpiValue} tabular-nums`}>
            {mu === 0 ? "0.0000" : mu >= 100 ? mu.toFixed(1) : mu.toFixed(4)}
          </span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Punto (x₁, x₂)</span>
          <span className={`${styles.kpiValue} tabular-nums`}>
            ({state.x1.toFixed(3)}, {state.x2.toFixed(3)})
          </span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Barrera P(x, μ)</span>
          <span className={`${styles.kpiValue} tabular-nums`}>
            {state.barrierValue === null ? "— (Frontera)" : state.barrierValue.toFixed(3)}
          </span>
        </div>

        <div className={`${styles.kpiCard} ${isOptimalReached ? styles.kpiOptimal : ""}`}>
          <span className={styles.kpiLabel}>Objetivo 3x₁ + 3x₂</span>
          <span
            className={`${styles.kpiValue} ${
              isOptimalReached ? styles.kpiValueOptimal : ""
            } tabular-nums`}
          >
            {state.objectiveValue.toFixed(3)}
          </span>
        </div>
      </div>

      {/* Tabla Sincronizada de Convergencia */}
      <div className={styles.tableWrapper}>
        <table className={`${styles.syncTable} tabular-nums`}>
          <thead>
            <tr>
              <th>μ</th>
              <th>x₁(μ)</th>
              <th>x₂(μ)</th>
              <th>P(x, μ)</th>
              <th>f(x) = 3x₁ + 3x₂</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, idx) => {
              const isHighlighted = idx === closestRowIdx;
              return (
                <tr
                  key={row.mu}
                  onClick={() => animateToMu(row.mu)}
                  className={`${styles.syncRow} ${isHighlighted ? styles.syncRowActive : ""}`}
                >
                  <td>{row.mu === 0 ? "0 (Límite)" : row.mu}</td>
                  <td>{row.x1.toFixed(4)}</td>
                  <td>{row.x2.toFixed(4)}</td>
                  <td>{row.barrierValue === null ? "−∞ (∂P)" : row.barrierValue.toFixed(3)}</td>
                  <td>{row.objectiveValue.toFixed(4)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}