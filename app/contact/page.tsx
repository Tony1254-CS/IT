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

type FormErrors = {
  name?: string;
  email?: string;
  budget?: string;
};

export default function ContactPage() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    budget: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

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

    const revealText = () => {
      const elements = Array.from(
        document.querySelectorAll<HTMLElement>("[data-contact-reveal]")
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

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }
    if (!formData.budget) {
      newErrors.budget = "Please select a budget range";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      // TODO: wire to a backend (Server Action) before launch — client-side
      // demo state only; nothing is persisted or transmitted yet.
      setSubmitted(true);
    }
  };

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
            <h1 className="font-display text-[clamp(3rem,10vw,8rem)] font-normal tracking-[-0.02em] leading-none text-ivory italic" data-contact-reveal>
              Begin a Project
            </h1>
            <p className="mt-6 text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed text-ivory/70 max-w-[42rem]" data-contact-reveal>
              Ready to start? Tell us about your project and we&apos;ll get back to you within one business day.
            </p>
            <div className="mt-10 flex items-center gap-2 text-mono text-[0.75rem] uppercase tracking-widest text-ivory/60">
              <span className="w-px h-4 bg-accent/30" />
              <span>Scroll down</span>
            </div>
          </div>
        </section>

        <section className="relative py-32 px-6 bg-background">
          <div className="max-w-[90rem] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-normal tracking-[-0.02em] text-foreground mb-8">Get in touch</h2>
                {submitted ? (
                  <div className="p-8 rounded-2xl border border-accent/30 bg-ivory/5">
                    <p className="font-display text-[clamp(1.5rem,2.5vw,2rem)] italic text-foreground">Thank you.</p>
                    <p className="mt-3 leading-relaxed text-foreground/70">
                      Your brief is with us — we&apos;ll get back to you within one business day.
                    </p>
                  </div>
                ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <label htmlFor="name" className="block mb-2 text-mono text-xs uppercase tracking-widest text-foreground/60">Name</label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-foreground/20 bg-ivory/5 text-foreground focus:border-accent/60 focus:outline-none"
                    />
                    {errors.name && <p className="mt-1 text-sm text-error">{errors.name}</p>}
                  </div>
                  <div className="space-y-4">
                    <label htmlFor="email" className="block mb-2 text-mono text-xs uppercase tracking-widest text-foreground/60">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-foreground/20 bg-ivory/5 text-foreground focus:border-accent/60 focus:outline-none"
                    />
                    {errors.email && <p className="mt-1 text-sm text-error">{errors.email}</p>}
                  </div>
                  <div className="space-y-4">
                    <label htmlFor="message" className="block mb-2 text-mono text-xs uppercase tracking-widest text-foreground/60">Message — optional</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-foreground/20 bg-ivory/5 text-foreground focus:border-accent/60 focus:outline-none resize-y"
                      placeholder="Tell us about your project — scope, timeline, constraints."
                    />
                  </div>
                  <div className="space-y-4">
                    <label htmlFor="budget" className="block mb-2 text-mono text-xs uppercase tracking-widest text-foreground/60">Budget Range</label>
                    <select
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-foreground/20 bg-ivory/5 text-foreground focus:border-accent/60 focus:outline-none"
                    >
                      <option value="">Select a range</option>
                      <option value="Under $10k">Under $10k</option>
                      <option value="$10k-$50k">$10k-$50k</option>
                      <option value="$50k-$100k">$50k-$100k</option>
                      <option value="$100k+">$100k+</option>
                    </select>
                    {errors.budget && <p className="mt-1 text-sm text-error">{errors.budget}</p>}
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-4 rounded-full bg-accent text-background font-medium uppercase tracking-widest hover:bg-accent/80 transition-colors"
                  >
                    Send message
                  </button>
                </form>
                )}
              </div>
              <div className="relative hidden md:block">
                <div className="sticky top-32">
                  <div className="p-8 rounded-2xl border border-accent/20 bg-ivory/5">
                    <h3 className="font-display text-[clamp(1.5rem,2.5vw,2rem)] font-normal tracking-[-0.01em] text-foreground mb-4">Contact</h3>
                    <div className="space-y-4">
                      <a
                        href="mailto:hello@quintessence.com"
                        className="inline-flex items-center gap-3 text-foreground/80 hover:text-foreground transition-colors"
                      >
                        hello@quintessence.com
                      </a>
                      <p className="text-foreground/60">We reply within one business day.</p>
                    </div>
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
