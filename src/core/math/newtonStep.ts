export interface KktNodeData {
  id: string;
  stepNumber: string;
  title: string;
  shortLabel: string;
  description: string;
  latexPrimary: string;
  latexSecondary?: string;
  matrixNote: string;
  keyInsight: string;
}

export interface NewtonIterationMetrics {
  iteration: number;
  primalResidualNorm: number; // ||r_p|| = ||b - Ax||
  dualResidualNorm: number;   // ||r_d|| = ||c - A^T λ - s||
  dualityGap: number;         // x^T s
  mu: number;                 // (x^T s) / n
  alphaPrimal: number;
  alphaDual: number;
}

/**
 * Simula una traza típica de convergencia Primal-Dual (PDIP)
 * demostrando convergencia cuadrática/superlineal en pocas iteraciones.
 */
export function generateSampleNewtonTrace(epsilon = 1e-6): NewtonIterationMetrics[] {
  const trace: NewtonIterationMetrics[] = [];
  let gap = 12.0;
  let rp = 2.5;
  let rd = 1.8;
  let iter = 0;

  while (gap > epsilon && iter < 15) {
    const mu = gap / 3;
    trace.push({
      iteration: iter,
      primalResidualNorm: rp,
      dualResidualNorm: rd,
      dualityGap: gap,
      mu,
      alphaPrimal: iter === 0 ? 0.72 : Math.min(0.995, 0.85 + iter * 0.03),
      alphaDual: iter === 0 ? 0.75 : Math.min(0.995, 0.88 + iter * 0.025),
    });

    // Reducción típica de predictor-corrector Mehrotra
    rp *= 0.14;
    rd *= 0.14;
    gap *= iter < 3 ? 0.22 : 0.08;
    iter++;
  }

  return trace;
}