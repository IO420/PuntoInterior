"use client";

import { useCallback, useEffect, useState } from "react";

export function usePresentationMode() {
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  const togglePresentationMode = useCallback(() => {
    setIsPresentationMode((prev) => !prev);
  }, []);

  useEffect(() => {
    const htmlEl = document.documentElement;
    if (isPresentationMode) {
      htmlEl.setAttribute("data-presentation", "true");
    } else {
      htmlEl.removeAttribute("data-presentation");
    }
  }, [isPresentationMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (isInput) return;

      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        togglePresentationMode();
      } else if (e.key === "Escape" && isPresentationMode) {
        setIsPresentationMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPresentationMode, togglePresentationMode]);

  return { isPresentationMode, togglePresentationMode };
}