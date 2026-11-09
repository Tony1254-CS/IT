"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroShader from "@/components/HeroShader";
import CustomCursor from "@/components/cursor";
import Nav from "@/components/nav";
import Preloader from "@/components/preloader";
import Footer from "@/components/footer";

gsap.registerPlugin(ScrollTrigger);

export default function ApproachPage() {
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
        document.querySelectorAll<HTMLElement>("[data-approach-reveal]")
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
            <h1 className="font-display text-[clamp(3rem,10vw,8rem)] font-semibold tracking-[-0.02em] leading-none text-ivory italic" data-approach-reveal>
              Our Approach
            </h1>
            <p className="mt-6 text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed text-ivory/70 max-w-[42rem]" data-approach-reveal>
              We believe in deliberate progress, not rapid iteration. Our four-step process guides you from insight to implementation.
            </p>
            <div className="mt-10 flex items-center gap-2 text-mono text-[0.75rem] uppercase tracking-widest text-ivory/40">
              <span className="w-px h-4 bg-accent/30" />
              <span>Scroll down</span>
            </div>
          </div>
        </section>

        <section className="relative py-32 px-6 bg-background">
          <div className="max-w-[90rem] mx-auto">
            <div className="relative flex flex-col md:flex-row gap-8">
              <div className="flex-1 relative md:w-1/4">
                <div className="relative p-8 rounded-2 border border-accent/20 bg-ivory/50">
                  <div className="absolute top-0 left-0 w-8 h-8 rounded-full border border-accent/30 bg-accent/10 flex items-center justify-center">
                    <span className="font-mono text-accent font-semibold">01</span>
                  </div>
                  <div className="pt-8 pl-8">
                    <h3 className="font-display text-[clamp(1.5rem,2.5vw,2.5rem)] font-semibold tracking-[-0.01em] text-background mb-4">Discover</h3>
                    <p className="text-background/80 leading-relaxed">Understanding your unique challenges and opportunities through deep consultation and technical assessment.</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 relative md:w-1/4">
                <div className="relative p-8 rounded-2 border border-accent/20 bg-ivory/50">
                  <div className="absolute top-0 left-0 w-8 h-8 rounded-full border border-accent/30 bg-accent/10 flex items-center justify-center">
                    <span className="font-mono text-accent font-semibold">02</span>
                  </div>
                  <div className="pt-8 pl-8">
                    <h3 className="font-display text-[clamp(1.5rem,2.5vw,2.5rem)] font-semibold tracking-[-0.01em] text-background mb-4">Define</h3>
                    <p className="text-background/80 leading-relaxed">Precise requirements and architect a solution path that balances ambition with practicality.</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 relative md:w-1/4">
                <div className="relative p-8 rounded-2 border border-accent/20 bg-ivory/50">
                  <div className="absolute top-0 left-0 w-8 h-8 rounded-full border border-accent/30 bg-accent/10 flex items-center justify-center">
                    <span className="font-mono text-accent font-semibold">03</span>
                  </div>
                  <div className="pt-8 pl-8">
                    <h3 className="font-display text-[clamp(1.5rem,2.5vw,2.5rem)] font-semibold tracking-[-0.01em] text-background mb-4">Build</h3>
                    <p className="text-background/80 leading-relaxed">Deploy and iterate with precision, ensuring every component works in harmony with the whole.</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 relative md:w-1/4">
                <div className="relative p-8 rounded-2 border border-accent/20 bg-ivory/50">
                  <div className="absolute top-0 left-0 w-8 h-8 rounded-full border border-accent/30 bg-accent/10 flex items-center justify-center">
                    <span className="font-mono text-accent font-semibold">04</span>
                  </div>
                  <div className="pt-8 pl-8">
                    <h3 className="font-display text-[clamp(1.5rem,2.5vw,2.5rem)] font-semibold tracking-[-0.01em] text-background mb-4">Sustain</h3>
                    <p className="text-background/80 leading-relaxed">Long-term support and optimization to ensure sustained performance and growth.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
