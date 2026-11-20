import { KktNodeData } from "../math/newtonStep";

export interface NavItem {
  id: string;
  number: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "introduccion", number: "01", label: "Introducción" },
  { id: "propiedades", number: "02", label: "Propiedades" },
  { id: "motor-primal-dual", number: "03", label: "Motor Primal-Dual" },
  { id: "laboratorio", number: "04", label: "Laboratorio μ" },
  { id: "aplicaciones", number: "05", label: "Aplicaciones" },
];

export const GLOSSARY_TERMS: Record<string, { title: string; definition: string }> = {
  politopo: {
    title: "Politopo Convexo P",
    definition:
      "Región factible acotada formada por la intersección de un número finito de semiespacios lineales Ax ≤ b.",
  },
  barrera: {
    title: "Barrera Logarítmica",
    definition:
      "Término de penalización -μ·ln(x) que diverge a +∞ cuando una variable se acerca a la frontera cero, manteniendo las iteraciones estrictamente en int(P).",
  },
  trayectoriaCentral: {
    title: "Trayectoria Central",
    definition:
      "Curva suave y única {x(μ) : μ > 0} formada por los optimizadores de la función barrera que converge al vértice óptimo cuando μ → 0⁺.",
  },
  brechaDualidad: {
    title: "Brecha de Dualidad (xᵀs)",
    definition:
      "Diferencia entre el valor objetivo primal y dual. En condiciones KKT perturbadas satisface xᵢsᵢ = μ, por lo que xᵀs = nμ → 0.",
  },
  weierstrass: {
    title: "Teorema de Weierstrass",
    definition:
      "Toda función continua definida sobre un conjunto compacto (cerrado y acotado) no vacío alcanza su máximo y mínimo globales.",
  },
};

export const KKT_FLOW_NODES: KktNodeData[] = [
  {
    id: "primal-dual",
    stepNumber: "PASO 01",
    title: "Par Primal-Dual Estándar",
    shortLabel: "Par Primal-Dual",
    description:
      "Formulamos simultáneamente el problema original (Primal) y su problema asociado (Dual) con variables de holgura no negativas x ≥ 0 y s ≥ 0.",
    latexPrimary: String.raw`\begin{aligned}
\text{(Primal)} \quad \min_{x} \; & c^T x \quad \text{s.a.} \quad Ax = b, \; x \ge 0 \\
\text{(Dual)} \quad \max_{\lambda, s} \; & b^T \lambda \quad \text{s.a.} \quad A^T \lambda + s = c, \; s \ge 0
\end{aligned}`,
    matrixNote: "A ∈ ℝᵐˣⁿ de rango completo por filas, x, s, c ∈ ℝⁿ, λ, b ∈ ℝᵐ.",
    keyInsight:
      "Por dualidad fuerte, en el óptimo se cumple cᵀx* = bᵀλ*, anulando la brecha xᵀs = 0.",
  },
  {
    id: "lagrangians",
    stepNumber: "PASO 02",
    title: "Lagrangianos con Barrera Logarítmica",
    shortLabel: "Lagrangianos Barrera",
    description:
      "Reemplazamos las restricciones de no negatividad x ≥ 0 y s ≥ 0 incorporando barreras logarítmicas parametrizadas por μ > 0 en las funciones Lagrangianas.",
    latexPrimary: String.raw`L_p(x, \lambda, \mu) = c^T x - \mu \sum_{j=1}^{n} \ln(x_j) - \lambda^T(Ax - b)`,
    latexSecondary: String.raw`L_d(\lambda, s, y, \mu) = b^T \lambda + \mu \sum_{j=1}^{n} \ln(s_j) - y^T(A^T\lambda + s - c)`,
    matrixNote: "El parámetro μ > 0 controla la fuerza de repulsión respecto a los hiperplanos xⱼ = 0 y sⱼ = 0.",
    keyInsight:
      "Al derivar L_p respecto a xⱼ se obtiene cⱼ - μ/xⱼ - (Aᵀλ)ⱼ = 0, identificando sⱼ = μ/xⱼ.",
  },
  {
    id: "perturbed-kkt",
    stepNumber: "PASO 03",
    title: "Condiciones KKT Perturbadas",
    shortLabel: "KKT Perturbadas",
    description:
      "Igualando los gradientes a cero obtenemos el sistema no lineal de Karush-Kuhn-Tucker perturbado, expresado mediante matrices diagonales X = Diag(x) y S = Diag(s).",
    latexPrimary: String.raw`F_\mu(x, \lambda, s) = \begin{bmatrix} Ax - b \\ A^T\lambda + s - c \\ XSe - \mu e \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}, \quad (x, s) > 0`,
    matrixNote: "e = (1, 1, …, 1)ᵀ ∈ ℝⁿ. La condición XSe = μe relaja la holgura complementaria xⱼsⱼ = 0.",
    keyInsight:
      "Para cada μ > 0 existe una única terna (x(μ), λ(μ), s(μ)) que define la Trayectoria Central Primal-Dual.",
  },
  {
    id: "newton-step",
    stepNumber: "PASO 04",
    title: "Iteración de Newton & Brecha de Dualidad",
    shortLabel: "Paso de Newton",
    description:
      "Linealizamos F_μ(x + Δx, λ + Δλ, s + Δs) = 0 mediante el método de Newton para calcular la dirección de búsqueda y actualizar con pasos α_p, α_d ∈ (0, 1].",
    latexPrimary: String.raw`\begin{bmatrix} A & 0 & 0 \\ 0 & A^T & I \\ S & 0 & X \end{bmatrix} \begin{bmatrix} \Delta x \\ \Delta \lambda \\ \Delta s \end{bmatrix} = \begin{bmatrix} r_p \\ r_d \\ \sigma \mu e - XSe \end{bmatrix}`,
    latexSecondary: String.raw`r_p = b - Ax, \quad r_d = c - A^T\lambda - s, \quad x^T s < \epsilon \; (\epsilon = 10^{-6})`,
    matrixNote: "El parámetro de centrado σ ∈ (0, 1) equilibra la reducción de μ con la permanencia en el interior.",
    keyInsight:
      "El algoritmo termina con precisión máquina cuando los residuales y la brecha xᵀs caen debajo de 10⁻⁶.",
  },
];

export interface ApplicationCardData {
  id: string;
  iconName: "Zap" | "Waves" | "ScanLine" | "GitBranch";
  domain: string;
  title: string;
  description: string;
  metricBadge: string;
}

export const ENGINEERING_APPLICATIONS: ApplicationCardData[] = [
  {
    id: "opf",
    iconName: "Zap",
    domain: "SISTEMAS ELÉCTRICOS",
    title: "Flujo Óptimo de Potencia (OPF)",
    description:
      "Minimización de costos operativos y estabilización de redes eléctricas en segundos ante fluctuaciones de carga mediante métodos Primal-Dual.",
    metricBadge: "Tiempo Real • Escala Nacional",
  },
  {
    id: "hydro",
    iconName: "Waves",
    domain: "ENERGÍA RENOVABLE",
    title: "Sistemas Hidroeléctricos",
    description:
      "Optimización de generación y reducción de pérdidas de transmisión en redes hidráulicas complejas acopladas temporalmente.",
    metricBadge: "Despacho Multi-Embalse",
  },
  {
    id: "deblurring",
    iconName: "ScanLine",
    domain: "VISIÓN COMPUTACIONAL",
    title: "Procesamiento de Imágenes (Deblurring)",
    description:
      "Reconstrucción y desenfoque inverso de imágenes formulado como problema primal-dual resuelto con Newton semi-suave.",
    metricBadge: "Regularización Total Variation",
  },
  {
    id: "fracture",
    iconName: "GitBranch",
    domain: "MECÁNICA COMPUTACIONAL",
    title: "Mecánica de Fracturas",
    description:
      "Cálculo de derivadas de forma de energía potencial para predecir la evolución de grietas curvilíneas en materiales.",
    metricBadge: "Elementos Finitos & Contacto",
  },
];

export interface ComparisonRow {
  criterion: string;
  simplex: string;
  interiorPoint: string;
}

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    criterion: "Trayectoria de Búsqueda",
    simplex: "Recorre vértices y aristas exteriores de la frontera ∂P.",
    interiorPoint: "Atraviesa el interior estricto int(P) siguiendo la Trayectoria Central.",
  },
  {
    criterion: "Iteraciones en Gran Escala",
    simplex: "Crecen significativamente con la dimensión del problema (peor caso exponencial).",
    interiorPoint: "Casi constantes e independientes del tamaño (típicamente 20 a 60 iteraciones).",
  },
  {
    criterion: "Costo por Iteración",
    simplex: "Bajo (actualización de pivoteo sobre base dispersa).",
    interiorPoint: "Moderado/Alto (factorización de Cholesky o sistema KKT simétrico).",
  },
  {
    criterion: "Mejor Caso de Uso",
    simplex: "Problemas pequeños/medianos y re-optimización rápida (warm-start).",
    interiorPoint: "Sistemas masivos con decenas o cientos de miles de variables y restricciones.",
  },
];