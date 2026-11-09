"use client";

import { useEffect, useState } from "react";

const PRELOADER_KEY = "quintessence:preloader:shown";

export default function Preloader({ onFinish }: { onFinish: () => void }) {
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState("letters");

  const alreadyShown =
    typeof window !== "undefined" &&
    sessionStorage.getItem(PRELOADER_KEY) === "1";

  useEffect(() => {
    if (alreadyShown) {
      const t = setTimeout(() => {
        setShow(false);
        onFinish();
      }, 0);
      return () => clearTimeout(t);
    }

    const toCurtain = setTimeout(() => setPhase("curtain"), 700);
    const finish = setTimeout(() => {
      sessionStorage.setItem(PRELOADER_KEY, "1");
      setShow(false);
      onFinish();
    }, 2200);

    return () => {
      clearTimeout(toCurtain);
      clearTimeout(finish);
    };
  }, [alreadyShown, onFinish]);

  const skip = () => {
    sessionStorage.setItem(PRELOADER_KEY, "1");
    setShow(false);
    onFinish();
  };

  if (!show) return null;

  const letters = "Quintessence".split("");

  return (
    <div
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
      onClick={skip}
    >
    <div className="absolute inset-0 bg-background z-20" />
    <div
      className={`absolute inset-0 bg-accent z-30 transition-transform duration-1000 ease-out transform ${phase === "curtain" ? "-translate-y-full" : "translate-y-0"}`}
    />

    <div className="relative z-40 flex flex-col items-center justify-center gap-1 pointer-events-none">
      <div className="flex gap-[0.05em]">
        {letters.map(function(char, i) {
          return (
            <span
              key={i}
              className="preloader-letter font-display text-[clamp(2rem,8vw,5rem)] font-semibold tracking-[0.5em] text-ivory italic"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
            {char}
            </span>
          );
        })}
      </div>
      </div>
      <p className="mt-4 text-[0.75rem] uppercase tracking-[0.5em] text-accent/60 preloader-fade">
        Click anywhere to skip
      </p>
    </div>
  );
}
