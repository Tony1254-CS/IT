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
        // the reveal must animate the mask alone. Opacity on a masked element
        // renders pre-reveal ink at ~1.5:1 contrast (axe/lighthouse failure);
        // the mask itself fully hides the ink until the reveal completes.
        const masked = el.classList.contains("ink-reveal");
        // The statement `.ink-reveal` sits so low in the document that its
        // bottom never crosses the default "bottom 20%" line before scroll-end
        // — the mask would stall mid-scrub and part of the text stays hidden
        // behind the parking position. Anchoring the reveal to the element's
        // own top (85% → 40% of the viewport) keeps the scrub completable for
        // masked blocks of any height; non-masked opacity reveals keep the
        // original bottom-anchored travel.
        if (masked) {
          gsap.fromTo(
            el,
            { maskPosition: "-100% 0", webkitMaskPosition: "-100% 0" },
            {
              maskPosition: "0% 0",
              webkitMaskPosition: "0% 0",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                end: "top 40%",
                scrub: true,
              },
            }
          );
        } else {
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
        }
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
            <div className="mt-16 flex items-center gap-2 text-mono text-[0.75rem] uppercase tracking-widest text-ivory/60">
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

