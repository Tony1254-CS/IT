"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroShader from "@/components/HeroShader";
import CustomCursor from "@/components/cursor";
import Nav from "@/components/nav";
import Preloader from "@/components/preloader";


gsap.registerPlugin(ScrollTrigger);

export default function PrinciplesPage() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const revealText = () => {
      const elements = Array.from(
        document.querySelectorAll<HTMLElement>("[data-principles-reveal]")
      );
      elements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0.2 },
          {
            opacity: 1,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "bottom 20%",
              scrub: true,
            },
          }
        );
      });
    };

    revealText();

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <Preloader onFinish={() => setPreloaderDone(true)} />
      <CustomCursor />

      {!preloaderDone && (
        <div className="fixed inset-0 z-[100] bg-background" />
      )}

      <Nav />

      <main className="flex-1 relative overflow-hidden">
        <section className="relative min-h-screen flex flex-col justify-center px-6">
          <HeroShader />
          <div className="relative z-10 max-w-[90rem] mx-auto">
            <h1 className="font-display text-[clamp(3rem,10vw,8rem)] font-semibold tracking-[-0.02em] leading-none text-ivory italic" data-principles-reveal>
              Our Principles
            </h1>
            <p className="mt-6 text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed text-ivory/70 max-w-[42rem]" data-principles-reveal>
              We operate within clear boundaries, build with intent, and deliver with precision.
            </p>
            <div className="mt-10 flex items-center gap-2 text-mono text-[0.75rem] uppercase tracking-widest text-ivory/40">
              <span className="w-px h-4 bg-accent/30" />
              <span>Scroll down</span>
            </div>
          </div>
        </section>

        <section className="bg-ivory text-background py-32 px-6">
          <div className="max-w-[70rem] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="relative p-8 rounded-2xl border border-accent/20 bg-white/80">
                <h3 className="font-display text-[clamp(1.5rem,2.5vw,2.5rem)] font-semibold tracking-[-0.01em] text-background mb-4">Scoped in writing</h3>
                <p className="text-background/80 leading-relaxed">Clear specifications that eliminate ambiguity and set precise expectations from day one.</p>
              </div>
              <div className="relative p-8 rounded-2xl border border-accent/20 bg-white/80">
                <h3 className="font-display text-[clamp(1.5rem,2.5vw,2.5rem)] font-semibold tracking-[-0.01em] text-background mb-4">Secure by default</h3>
                <p className="text-background/80 leading-relaxed">Built-in safeguards that protect your data and systems without requiring additional configuration.</p>
              </div>
              <div className="relative p-8 rounded-2xl border border-accent/20 bg-white/80">
                <h3 className="font-display text-[clamp(1.5rem,2.5vw,2.5rem)] font-semibold tracking-[-0.01em] text-background mb-4">Documented handover</h3>
                <p className="text-background/80 leading-relaxed">Comprehensive documentation and handoff that ensures continuity and future maintainability.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
