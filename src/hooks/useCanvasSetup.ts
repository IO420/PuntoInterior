"use client";

import { useEffect, useRef, useState } from "react";

export interface CanvasDimensions {
  width: number;
  height: number;
  dpr: number;
}

export function useCanvasSetup() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dimensions, setDimensions] = useState<CanvasDimensions>({
    width: 0,
    height: 0,
    dpr: 1,
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      setDimensions({ width, height, dpr });
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return { containerRef, canvasRef, dimensions };
}