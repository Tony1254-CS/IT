"use client";

import { useEffect, useState, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroShader from "@/components/HeroShader";
import CustomCursor from "@/components/cursor";
import Nav from "@/components/nav";
import Preloader from "@/components/preloader";


gsap.registerPlugin(ScrollTrigger);

export default function CapabilitiesPage() {
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
            <h1 className="font-display text-[clamp(3rem,10vw,8rem)] font-semibold tracking-[-0.02em] leading-none text-ivory italic" data-cap-reveal>
              Capabilities
            </h1>
            <p className="mt-6 text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed text-ivory/70 max-w-[42rem]" data-cap-reveal>
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
            <h2 className="font-display text-[clamp(2rem,6vw,4rem)] font-semibold tracking-[-0.02em] leading-none text-background italic">
              Our Capabilities
            </h2>
          </div>
        </section>

        <section className="relative py-32 px-6 bg-background">
          <div className="max-w-[90rem] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group relative p-6 rounded-2xl border border-accent/20 bg-ivory/50 hover:border-accent/40 hover:bg-ivory/80 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border border-accent/30 bg-accent/10 transition-colors group-hover:border-accent/60 group-hover:bg-accent/20">
                    <span className="font-mono text-background font-semibold">01</span>
                  </div>
                  <h3 className="font-display text-[clamp(1.5rem,2.5vw,2.5rem)] font-semibold tracking-[-0.01em] text-background">Software Engineering</h3>
                </div>
                <p className="text-mono text-xs uppercase tracking-widest text-background mb-4">Web apps, Mobile, Backend, Modernization</p>
                <p className="text-background leading-relaxed">Custom web applications, native mobile experiences, robust backend systems, and legacy modernization that integrate seamlessly with your existing infrastructure.</p>
              </div>

              <div className="group relative p-6 rounded-2xl border border-accent/20 bg-ivory/50 hover:border-accent/40 hover:bg-ivory/80 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border border-accent/30 bg-accent/10 transition-colors group-hover:border-accent/60 group-hover:bg-accent/20">
                    <span className="font-mono text-background font-semibold">02</span>
                  </div>
                  <h3 className="font-display text-[clamp(1.5rem,2.5vw,2.5rem)] font-semibold tracking-[-0.01em] text-background">Applied AI</h3>
                </div>
                <p className="text-mono text-xs uppercase tracking-widest text-background mb-4">LLM integration, RAG, Agents, Computer vision</p>
                <p className="text-background leading-relaxed">Intelligent agents that understand context, retrieval-augmented generation for accurate responses, and computer vision capabilities for visual understanding.</p>
              </div>

              <div className="group relative p-6 rounded-2xl border border-accent/20 bg-ivory/50 hover:border-accent/40 hover:bg-ivory/80 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border border-accent/30 bg-accent/10 transition-colors group-hover:border-accent/60 group-hover:bg-accent/20">
                    <span className="font-mono text-background font-semibold">03</span>
                  </div>
                  <h3 className="font-display text-[clamp(1.5rem,2.5vw,2.5rem)] font-semibold tracking-[-0.01em] text-background">Cybersecurity</h3>
                </div>
                <p className="text-mono text-xs uppercase tracking-widest text-background mb-4">Penetration testing, Secure code review, Cloud security, Compliance support</p>
                <p className="text-background leading-relaxed">Comprehensive security assessment, code review for vulnerabilities, cloud infrastructure hardening, and compliance validation to protect your digital assets.</p>
              </div>

              <div className="group relative p-6 rounded-2xl border border-accent/20 bg-ivory/50 hover:border-accent/40 hover:bg-ivory/80 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border border-accent/30 bg-accent/10 transition-colors group-hover:border-accent/60 group-hover:bg-accent/20">
                    <span className="font-mono text-background font-semibold">04</span>
                  </div>
                  <h3 className="font-display text-[clamp(1.5rem,2.5vw,2.5rem)] font-semibold tracking-[-0.01em] text-background">Cloud & Infrastructure</h3>
                </div>
                <p className="text-mono text-xs uppercase tracking-widest text-background mb-4">Cloud, DevOps, Kubernetes, Observability</p>
                <p className="text-background leading-relaxed">Scalable cloud architectures, DevOps automation, container orchestration, and comprehensive observability for mission-critical systems.</p>
              </div>

              <div className="group relative p-6 rounded-2xl border border-accent/20 bg-ivory/50 hover:border-accent/40 hover:bg-ivory/80 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border border-accent/30 bg-accent/10 transition-colors group-hover:border-accent/60 group-hover:bg-accent/20">
                    <span className="font-mono text-background font-semibold">05</span>
                  </div>
                  <h3 className="font-display text-[clamp(1.5rem,2.5vw,2.5rem)] font-semibold tracking-[-0.01em] text-background">Design & Brand</h3>
                </div>
                <p className="text-mono text-xs uppercase tracking-widest text-background mb-4">Product design, Brand systems, Motion</p>
                <p className="text-background leading-relaxed">Thoughtful product design, cohesive brand systems, and deliberate motion that guides user attention and enhances engagement.</p>
              </div>

              <div className="group relative p-6 rounded-2xl border border-accent/20 bg-ivory/50 hover:border-accent/40 hover:bg-ivory/80 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border border-accent/30 bg-accent/10 transition-colors group-hover:border-accent/60 group-hover:bg-accent/20">
                    <span className="font-mono text-background font-semibold">06</span>
                  </div>
                  <h3 className="font-display text-[clamp(1.5rem,2.5vw,2.5rem)] font-semibold tracking-[-0.01em] text-background">Growth</h3>
                </div>
                <p className="text-mono text-xs uppercase tracking-widest text-background mb-4">SEO, Analytics, Performance marketing</p>
                <p className="text-background leading-relaxed">Search optimization, data-driven analytics, and performance marketing that scales with your growth objectives and drives measurable results.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
