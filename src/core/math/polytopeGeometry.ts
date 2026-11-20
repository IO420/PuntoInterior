import { evaluateBarrierFunction } from "./barrierSolver";

export interface Point2D {
  x: number;
  y: number;
}

export interface ContourLine {
  level: number;
  segments: Array<[Point2D, Point2D]>;
}

/**
 * Vértices de la región factible del laboratorio numérico:
 * x1 + x2 <= 4, x1 >= 0, x2 >= 0
 */
export const LAB_FEASIBLE_VERTICES: Point2D[] = [
  { x: 0, y: 0 },
  { x: 4, y: 0 },
  { x: 0, y: 4 },
];

export const ANALYTIC_CENTER: Point2D = { x: 4 / 3, y: 4 / 3 };
export const OPTIMAL_VERTEX: Point2D = { x: 2, y: 2 };

/**
 * Genera los puntos de la trayectoria central desde μ = 1000 hasta μ = 0
 */
export function sampleCentralPathCurve(steps = 60): Point2D[] {
  const points: Point2D[] = [];
  // Desde μ = 1000 hasta μ = 0.001 en escala logarítmica
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const logMu = 3 * (1 - t) + -3 * t; // 10^3 -> 10^-3
    const mu = Math.pow(10, logMu);
    const term = 3 * (4 - mu);
    const x = (term + Math.sqrt(9 * Math.pow(4 - mu, 2) + 96 * mu)) / 12;
    points.push({ x, y: x });
  }
  points.push({ x: 2, y: 2 });
  return points;
}

/**
 * Calcula 6 isocontornos (curvas de nivel) de P(x1, x2, μ) alrededor del máximo actual
 * usando Marching Squares sobre el dominio [0.02, 3.98]^2.
 */
export function computeBarrierContours(
  mu: number,
  maxBarrierVal: number | null,
  gridRes = 56
): ContourLine[] {
  const effectiveMu = Math.max(mu, 0.015);
  const peak =
    maxBarrierVal !== null && mu > 0.015
      ? maxBarrierVal
      : evaluateBarrierFunction(1.995, 1.995, effectiveMu) ?? 11.9;

  // 6 niveles descendentes desde el pico actual
  const stepDelta = effectiveMu >= 10 ? effectiveMu * 0.45 : Math.max(0.35, effectiveMu * 0.85);
  const levels = Array.from({ length: 6 }, (_, i) => peak - (i + 1) * stepDelta);

  const minCoord = 0.02;
  const maxCoord = 3.98;
  const step = (maxCoord - minCoord) / gridRes;

  // Evaluar grilla escalar
  const grid: (number | null)[][] = Array.from({ length: gridRes + 1 }, (_, i) => {
    const x1 = minCoord + i * step;
    return Array.from({ length: gridRes + 1 }, (_, j) => {
      const x2 = minCoord + j * step;
      if (x1 + x2 >= 3.995) return null;
      return evaluateBarrierFunction(x1, x2, effectiveMu);
    });
  });

  const interpolate = (
    p1: Point2D,
    p2: Point2D,
    v1: number,
    v2: number,
    target: number
  ): Point2D => {
    if (Math.abs(v2 - v1) < 1e-9) return p1;
    const t = (target - v1) / (v2 - v1);
    return {
      x: p1.x + t * (p2.x - p1.x),
      y: p1.y + t * (p2.y - p1.y),
    };
  };

  return levels.map((level) => {
    const segments: Array<[Point2D, Point2D]> = [];

    for (let i = 0; i < gridRes; i++) {
      for (let j = 0; j < gridRes; j++) {
        const v00 = grid[i][j];
        const v10 = grid[i + 1][j];
        const v11 = grid[i + 1][j + 1];
        const v01 = grid[i][j + 1];

        if (v00 === null || v10 === null || v11 === null || v01 === null) continue;

        const p00 = { x: minCoord + i * step, y: minCoord + j * step };
        const p10 = { x: minCoord + (i + 1) * step, y: minCoord + j * step };
        const p11 = { x: minCoord + (i + 1) * step, y: minCoord + (j + 1) * step };
        const p01 = { x: minCoord + i * step, y: minCoord + (j + 1) * step };

        let state = 0;
        if (v00 >= level) state |= 1;
        if (v10 >= level) state |= 2;
        if (v11 >= level) state |= 4;
        if (v01 >= level) state |= 8;

        if (state === 0 || state === 15) continue;

        const edges: Point2D[] = [];
        if ((state & 1) !== (state & 2) >> 1) edges.push(interpolate(p00, p10, v00, v10, level));
        if ((state & 2) >> 1 !== (state & 4) >> 2) edges.push(interpolate(p10, p11, v10, v11, level));
        if ((state & 4) >> 2 !== (state & 8) >> 3) edges.push(interpolate(p11, p01, v11, v01, level));
        if ((state & 8) >> 3 !== (state & 1)) edges.push(interpolate(p01, p00, v01, v00, level));

        if (edges.length >= 2) {
          segments.push([edges[0], edges[1]]);
          if (edges.length === 4) {
            segments.push([edges[2], edges[3]]);
          }
        }
      }
    }

    return { level, segments };
  });
}

/**
 * Vértices normalizados [0..1] de un hexágono convexo irregular para HeroPolytopeCanvas.
 * El camino Simplex recorre los índices [0 -> 1 -> 2 -> 3 -> 4] (4 aristas),
 * mientras que Punto Interior parte de interiorStart hacia el óptimo en índice 4.
 */
export const HERO_POLYTOPE = {
  vertices: [
    { x: 0.22, y: 0.78 }, // 0: Inicio Simplex
    { x: 0.14, y: 0.48 }, // 1: Vértice 1
    { x: 0.30, y: 0.20 }, // 2: Vértice 2
    { x: 0.62, y: 0.14 }, // 3: Vértice 3
    { x: 0.86, y: 0.34 }, // 4: Óptimo Global (x*)
    { x: 0.74, y: 0.76 }, // 5: Vértice inferior derecho
  ] as Point2D[],
  interiorStart: { x: 0.46, y: 0.52 } as Point2D,
  controlPoint1: { x: 0.54, y: 0.38 } as Point2D,
  controlPoint2: { x: 0.72, y: 0.33 } as Point2D,
};