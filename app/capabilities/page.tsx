"use client";

import { useEffect, useState, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroShader from "@/components/HeroShader";
import CustomCursor from "@/components/cursor";
import Nav from "@/components/nav";
import Preloader from "@/components/preloader";
import Footer from "@/components/footer";
import { capabilities } from "@/data/capabilities";

gsap.registerPlugin(ScrollTrigger);

export default function CapabilitiesPage() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

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

    const revealCaps = () => {
      const elements = Array.from(
        document.querySelectorAll<HTMLElement>("[data-cap-reveal]")
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

    revealCaps();

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
            <h1
              className="font-display text-[clamp(3rem,10vw,8rem)] font-normal tracking-[-0.02em] leading-none text-ivory italic"
              data-cap-reveal
            >
              Capabilities
            </h1>
            <p
              className="mt-6 text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed text-ivory/70 max-w-[42rem]"
              data-cap-reveal
            >
              Software, intelligence and security systems built for companies that expect more.
            </p>
            <div className="mt-10 flex items-center gap-2 text-mono text-[0.75rem] uppercase tracking-widest text-ivory/60">
              <span className="w-px h-4 bg-accent/30" />
              <span>Scroll down</span>
            </div>
          </div>
        </section>

        <section className="bg-ivory text-background py-32 px-6">
          <div className="max-w-[70rem] mx-auto">
            <h2 className="font-display text-[clamp(2rem,6vw,4rem)] font-normal tracking-[-0.02em] leading-none text-background italic">
              Our Capabilities
            </h2>
          </div>
        </section>

        <section className="relative py-32 px-6 bg-background">
          <div className="max-w-[90rem] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {capabilities.map((item) => (
                <div
                  key={item.id}
                  className="group relative p-8 rounded-2xl border border-accent/20 bg-ivory/50 hover:border-accent/50 hover:bg-ivory/70 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center justify-center w-11 h-11 rounded-full border border-accent/30 bg-accent/10 transition-colors group-hover:border-accent group-hover:bg-accent/20">
                      <span className="font-mono text-xs text-background font-medium tracking-wider">
                        {item.number}
                      </span>
                    </div>
                    <h3 className="font-display text-[clamp(1.5rem,2.2vw,2.25rem)] font-normal tracking-[-0.01em] text-background">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-mono text-xs uppercase tracking-widest text-background/80 mb-4">
                    {item.tags}
                  </p>
                  <p className="text-background leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
