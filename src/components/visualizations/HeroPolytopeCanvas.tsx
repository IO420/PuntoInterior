// src/components/visualizations/HeroPolytopeCanvas.tsx
"use client";

import React, { useEffect, useState } from "react";
import { HERO_POLYTOPE, Point2D } from "@/core/math/polytopeGeometry";
import { useCanvasSetup } from "@/hooks/useCanvasSetup";
import styles from "./HeroPolytopeCanvas.module.css";

interface HeroPolytopeCanvasProps {
  restartTrigger: number;
}

function cubicBezier(
  p0: Point2D,
  p1: Point2D,
  p2: Point2D,
  p3: Point2D,
  t: number,
): Point2D {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  return {
    x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
  };
}

export function HeroPolytopeCanvas({
  restartTrigger,
}: HeroPolytopeCanvasProps) {
  const { containerRef, canvasRef, dimensions } = useCanvasSetup();
  const [simplexEdgesCount, setSimplexEdgesCount] = useState(0);
  const [ipmConverged, setIpmConverged] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let startTime = performance.now();
    const cycleDuration = 6200;
    const travelDuration = 4200;

    const render = (now: number) => {
      const elapsed = (now - startTime) % cycleDuration;
      const progress = Math.min(1, elapsed / travelDuration);

      const { width: w, height: h, dpr } = dimensions;
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      // Cuadrícula editorial muy sutil dentro de la figura
      ctx.strokeStyle = "rgba(15, 23, 42, 0.04)";
      ctx.lineWidth = 1;
      for (let gx = 24; gx < w; gx += 24) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = 24; gy < h; gy += 24) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      const toPx = (p: Point2D): Point2D => ({
        x: p.x * w,
        y: p.y * h,
      });

      const verts = HERO_POLYTOPE.vertices.map(toPx);
      const startInt = toPx(HERO_POLYTOPE.interiorStart);
      const cp1 = toPx(HERO_POLYTOPE.controlPoint1);
      const cp2 = toPx(HERO_POLYTOPE.controlPoint2);
      const optimalPx = verts[4];

      // 1. Región factible int(P)
      ctx.beginPath();
      verts.forEach((v, idx) => {
        if (idx === 0) ctx.moveTo(v.x, v.y);
        else ctx.lineTo(v.x, v.y);
      });
      ctx.closePath();
      ctx.fillStyle = "rgba(67, 56, 202, 0.07)";
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(67, 56, 202, 0.55)";
      ctx.stroke();

      // Etiqueta int(P)
      ctx.font = "500 12px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#475569";
      ctx.fillText("int(P) = {x : Ax < b}", startInt.x - 62, startInt.y + 38);

      // 2. Vértices del politopo
      verts.forEach((v, idx) => {
        ctx.beginPath();
        ctx.arc(v.x, v.y, idx === 4 ? 5.5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = idx === 4 ? "#047857" : "#4338CA";
        ctx.fill();
      });

      // 3. Trayectoria Simplex (4 aristas: 0->1->2->3->4)
      const totalEdges = Math.min(4, verts.length - 1);
      if (totalEdges > 0) {
        const simplexProgress = Math.min(0.9999, Math.max(0, progress * 1.15));
        const edgeFloat = simplexProgress * totalEdges;
        const currentEdge = Math.min(
          totalEdges - 1,
          Math.max(0, Math.floor(edgeFloat)),
        );
        const edgeT = edgeFloat - currentEdge;

        setSimplexEdgesCount(
          progress * 1.15 >= 1
            ? totalEdges
            : Math.min(totalEdges, Math.floor(edgeFloat + 0.02)),
        );

        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = "#BE123C";
        ctx.lineWidth = 2.2;
        ctx.moveTo(verts[0].x, verts[0].y);
        for (let i = 0; i < currentEdge; i++) {
          ctx.lineTo(verts[i + 1].x, verts[i + 1].y);
        }
        const edgeStart = verts[currentEdge];
        const edgeEnd = verts[currentEdge + 1] ?? edgeStart;
        const simplexPos: Point2D = {
          x: edgeStart.x + (edgeEnd.x - edgeStart.x) * edgeT,
          y: edgeStart.y + (edgeEnd.y - edgeStart.y) * edgeT,
        };
        ctx.lineTo(simplexPos.x, simplexPos.y);
        ctx.stroke();
        ctx.restore();

        ctx.beginPath();
        ctx.arc(simplexPos.x, simplexPos.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#BE123C";
        ctx.fill();
      }

      // 4. Trayectoria Central Punto Interior (Azul Cobalto Profundo)
      const ipmProgress = Math.min(1, progress * 1.32);
      const easedIpm = 1 - Math.pow(1 - ipmProgress, 2.2);
      setIpmConverged(easedIpm >= 0.985);

      const samples = 48;
      const maxSample = Math.max(1, Math.floor(easedIpm * samples));
      ctx.beginPath();
      ctx.moveTo(startInt.x, startInt.y);
      for (let s = 1; s <= maxSample; s++) {
        const pt = cubicBezier(startInt, cp1, cp2, optimalPx, s / samples);
        ctx.lineTo(pt.x, pt.y);
      }
      const ipmPos = cubicBezier(startInt, cp1, cp2, optimalPx, easedIpm);
      ctx.lineTo(ipmPos.x, ipmPos.y);
      ctx.strokeStyle = "#0369A1";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(startInt.x, startInt.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#0369A1";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(ipmPos.x, ipmPos.y, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = "#0369A1";
      ctx.fill();

      // 5. Onda expansiva Esmeralda al llegar al óptimo x*
      if (easedIpm >= 0.98) {
        const ripplePhase = ((elapsed - travelDuration * 0.72) % 1600) / 1600;
        if (ripplePhase >= 0) {
          ctx.beginPath();
          ctx.arc(
            optimalPx.x,
            optimalPx.y,
            7 + ripplePhase * 24,
            0,
            Math.PI * 2,
          );
          ctx.strokeStyle = `rgba(4, 120, 87, ${(1 - ripplePhase) * 0.75})`;
          ctx.lineWidth = 1.8;
          ctx.stroke();
        }
      }

      ctx.font = "600 12px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#047857";
      ctx.fillText("Óptimo x*", optimalPx.x - 28, optimalPx.y - 14);

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    startTime = performance.now();
    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions, restartTrigger]);

  return (
    <div className={styles.card}>
      <div className={styles.overlayTop}>
        <div className={styles.legendGroup}>
          <div className={styles.legendRow}>
            <span className={styles.swatchIpm} />
            <span>Punto Interior: Trayectoria continua</span>
          </div>
          <div className={styles.legendRow}>
            <span className={styles.swatchSimplex} />
            <span className="tabular-nums">
              Simplex: {simplexEdgesCount} / 4 aristas
            </span>
          </div>
        </div>

        {ipmConverged && (
          <span className={styles.statusBadge}>x(μ) → x* CONVERGIDO</span>
        )}
      </div>

      <div ref={containerRef} className={styles.canvasHost}>
        <canvas ref={canvasRef} />
      </div>

      <div className={styles.overlayBottom}>
        <span>FIG. 1 — Frontera ∂P vs. Interior int(P)</span>
        <span>Centro Analítico → Vértice Óptimo</span>
      </div>
    </div>
  );
}
