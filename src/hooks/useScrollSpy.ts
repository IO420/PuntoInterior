"use client";

import { useEffect, useState } from "react";

export function useScrollSpy(sectionIds: string[], offset = 220) {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] || "");

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;

      let currentActive = sectionIds[0];
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            currentActive = id;
          }
        }
      }
      setActiveId(currentActive);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds, offset]);

  return activeId;
}