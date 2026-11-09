"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Nav from "@/components/nav";
import Preloader from "@/components/preloader";
import HeroShader from "@/components/HeroShader";
import CustomCursor from "@/components/cursor";
import Footer from "@/components/footer";

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
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
        document.querySelectorAll<HTMLElement>("[data-scroll]")
      );
      elements.forEach((el) => {
        // `.ink-reveal[data-scroll]` hides text behind a mask parked at -100%;
        // the reveal only completes if the mask itself is animated, not just opacity.
        const masked = el.classList.contains("ink-reveal");
        gsap.fromTo(
          el,
          {
            opacity: 0.2,
            ...(masked ? { maskPosition: "-100% 0", webkitMaskPosition: "-100% 0" } : {}),
          },
          {
            opacity: 1,
            ...(masked ? { maskPosition: "0% 0", webkitMaskPosition: "0% 0" } : {}),
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

  const handlePreloaderFinish = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <Preloader onFinish={handlePreloaderFinish} />
      <CustomCursor />

      {!preloaderDone && (
        <div className="fixed inset-0 z-[100] bg-background" />
      )}

      <Nav />

      <main className="flex-1 relative overflow-hidden">
        <section className="relative min-h-screen flex flex-col justify-center px-6">
          <HeroShader />
          <div className="relative z-10 max-w-[90rem] mx-auto">
            <h1
              className="font-display text-[clamp(3rem,10vw,8rem)] font-semibold tracking-[-0.02em] leading-none text-ivory italic"
              data-scroll
            >
              Engineered with intent.
            </h1>
            <p
              className="mt-6 text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed text-ivory/70 max-w-[42rem]"
              data-scroll
            >
              Software, intelligence and security for companies that expect more.
            </p>
            <Link
              href="/contact"
              className="mt-10 inline-flex items-center justify-center h-12 w-32 rounded-full border border-accent/40 bg-accent/5 px-6 text-accent text-xs font-medium uppercase tracking-widest transition-all hover:bg-accent hover:text-background cursor"
            >
              Begin a project
            </Link>
            <div className="mt-16 flex items-center gap-2 text-mono text-[0.75rem] uppercase tracking-widest text-ivory/40">
              <span className="w-px h-4 bg-accent/30" />
              <span>Scroll</span>
            </div>
          </div>
        </section>

        <section className="bg-ivory text-background py-24 px-6">
          <div className="max-w-[70rem] mx-auto">
            <p
              className="font-display text-[clamp(2rem,6vw,3.5rem)] font-semibold tracking-[-0.02em] leading-none text-background italic ink-reveal"
              data-scroll
            >
              We build the systems behind ambitious companies. Fewer moving
              parts. Higher standards. Nothing ornamental that does not earn
              its place.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

