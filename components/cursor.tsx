"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  // Interactions are rare; state here is fine. Raw position is not — it flows
  // through a ref + rAF straight into a transform, never through React state.
  const [isHovering, setIsHovering] = useState(false);
  const [isOverInteractive, setIsOverInteractive] = useState(false);

  useEffect(() => {
    // Touch input has no cursor: never render one.
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    let targetX = 0;
    let targetY = 0;
    let raf = 0;

    const applyPosition = () => {
      raf = 0;
      const node = cursorRef.current;
      if (node) node.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setVisible(true); // idempotent — React bails out after the first flip
      if (!raf) raf = requestAnimationFrame(applyPosition);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      // Guard: document-level listeners can fire with non-Element targets
      // (e.g. the Document), and `.closest` only exists on Element.
      if (!(e.target instanceof Element)) return;
      if (e.target.tagName === "A" || e.target.tagName === "BUTTON" || e.target.closest("a") || e.target.closest("button")) {
        setIsOverInteractive(true);
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      setIsOverInteractive(false);
      setIsHovering(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter, true);
    document.addEventListener("mouseleave", handleMouseLeave, true);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter, true);
      document.removeEventListener("mouseleave", handleMouseLeave, true);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      if (raf) cancelAnimationFrame(raf);
    };

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Tab") {
        setIsOverInteractive(true);
        setIsHovering(true);
      }
    }

    function handleKeyUp() {
      setIsOverInteractive(false);
      setIsHovering(false);
    }
  }, []);

  // Initial render must be null on server AND client (no first-paint flash at
  // 0,0); `visible` flips on the first mousemove, which only exists client-side.
  if (!visible) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-50"
      data-cursor
    >
      <div
        className={`relative w-6 h-6 transition-all duration-300 ease-out ${isHovering ? "scale-150" : "scale-100"}`}
        style={{
          filter: isOverInteractive || isHovering ? "brightness(1.2)" : "brightness(1)",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isHovering ? (
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="#C8B28A"
              strokeWidth="1.5"
              fill="none"
            />
          ) : (
            <circle cx="12" cy="12" r="2" fill="#C8B28A" />
          )}
        </svg>
      </div>
    </div>
  );
}
