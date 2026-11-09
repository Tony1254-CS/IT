"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isOverInteractive, setIsOverInteractive] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target;
      // Guard: document-level listeners can fire with non-Element targets
      // (e.g. the Document), and `.closest` only exists on Element.
      if (!(target instanceof Element)) return;
      if (target.tagName === "A" || target.tagName === "BUTTON" || target.closest("a") || target.closest("button")) {
        setIsOverInteractive(true);
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      setIsOverInteractive(false);
      setIsHovering(false);
    };

    document.addEventListener("mousemove", updateCursorPosition);
    document.addEventListener("mouseenter", handleMouseEnter, true);
    document.addEventListener("mouseleave", handleMouseLeave, true);

    return () => {
      document.removeEventListener("mousemove", updateCursorPosition);
      document.removeEventListener("mouseenter", handleMouseEnter, true);
      document.removeEventListener("mouseleave", handleMouseLeave, true);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setIsOverInteractive(true);
        setIsHovering(true);
      }
    };

    const handleKeyUp = () => {
      setIsOverInteractive(false);
      setIsHovering(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) {
      // Store the new position in a ref to avoid triggering state updates synchronously
      const newPosition = { x: -100, y: -100 };
      // Schedule state update in the next tick
      const timeoutId = setTimeout(() => {
        setPosition(newPosition);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, []);

  if (position.x === -100 && position.y === -100) return null;


  return (
    <div
      className="fixed inset-0 pointer-events-none z-50" style={{ left: position.x, top: position.y }}
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