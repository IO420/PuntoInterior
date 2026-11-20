export interface CentralPathState {
  mu: number;
  x1: number;
  x2: number;
  objectiveValue: number; // f(x) = 3x1 + 3x2
  barrierValue: number | null; // P(x1, x2, mu) (null cuando mu = 0 en la frontera)
  dualityGapEstimate: number; // Aproximación 3 * mu (3 restricciones)
}

export const MU_PRESETS: number[] = [1000, 100, 10, 1, 0.1, 0.01, 0];

/**
 * Calcula el punto exacto en la trayectoria central x1(μ) = x2(μ)
 * derivado de: 6x1^2 - 3x1(4 - μ) - 4μ = 0
 */
export function solveCentralPathPoint(mu: number): CentralPathState {
  if (mu <= 1e-9) {
    return {
      mu: 0,
      x1: 2,
      x2: 2,
      objectiveValue: 12,
      barrierValue: null,
      dualityGapEstimate: 0,
    };
  }

  const term = 3 * (4 - mu);
  const discriminant = 9 * Math.pow(4 - mu, 2) + 96 * mu;
  const x = (term + Math.sqrt(discriminant)) / 12;

  const objectiveValue = 3 * x + 3 * x;
  const barrierValue = evaluateBarrierFunction(x, x, mu);

  return {
    mu,
    x1: x,
    x2: x,
    objectiveValue,
    barrierValue,
    dualityGapEstimate: 3 * mu,
  };
}

/**
 * Evalúa P(x1, x2, μ) = 3x1 + 3x2 + μ * [ln(4 - x1 - x2) + ln(x1) + ln(x2)]
 */
export function evaluateBarrierFunction(
  x1: number,
  x2: number,
  mu: number
): number | null {
  const slack = 4 - x1 - x2;
  if (x1 <= 0 || x2 <= 0 || slack <= 0) {
    return null; // Fuera del interior int(P)
  }
  if (mu <= 0) {
    return 3 * x1 + 3 * x2;
  }

  const logBarrier = Math.log(slack) + Math.log(x1) + Math.log(x2);
  return 3 * x1 + 3 * x2 + mu * logBarrier;
}

/**
 * Genera la tabla precalculada para los valores hito de μ
 */
export function getConvergenceTableData(): CentralPathState[] {
  return MU_PRESETS.map((mu) => solveCentralPathPoint(mu));
}

/**
 * Encuentra el índice de la fila más cercana en escala logarítmica al valor actual de μ
 */
export function findClosestPresetIndex(currentMu: number): number {
  if (currentMu <= 0.003) return MU_PRESETS.length - 1; // μ = 0

  const logCurrent = Math.log10(currentMu);
  let bestIdx = 0;
  let minDiff = Infinity;

  MU_PRESETS.forEach((preset, idx) => {
    const logPreset = preset === 0 ? -3 : Math.log10(preset);
    const diff = Math.abs(logCurrent - logPreset);
    if (diff < minDiff) {
      minDiff = diff;
      bestIdx = idx;
    }
  });

  return bestIdx;
}