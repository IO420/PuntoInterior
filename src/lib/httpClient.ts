import axios from "axios";

/**
 * Instancia base de Axios preparada para futura escalabilidad
 * (conexión a solvers remotos, almacenamiento de sesiones o benchmarks).
 */
export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default httpClient;