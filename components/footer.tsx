"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function Footer() {
  // Read current time only on the client: Cache Components blocks `new Date()`
  // during prerender. The shell renders an empty year; it fills in after hydration.
  const [currentYear, setCurrentYear] = useState<string>("");

  useEffect(() => {
    // Deferred like components/cursor.tsx: sync setState in an effect body is
    // flagged by react-hooks/set-state-in-effect (cascading renders).
    const id = setTimeout(() => {
      setCurrentYear(String(new Date().getFullYear()));
    }, 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <footer className="relative bg-background border-t border-accent/20">
      <div className="max-w-[90rem] mx-auto px-6 py-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <div className="font-display text-2xl font-semibold tracking-tight text-ivory italic">
                Quintessence
              </div>
            </Link>
            <p className="text-ivory/60 text-sm leading-relaxed max-w-xs">
              Software, intelligence and security systems built for companies that expect more.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h2 className="font-display text-lg font-semibold text-ivory mb-6">Navigation</h2>
            <nav className="grid grid-cols-2 gap-x-12 gap-y-3" aria-label="Footer">
              <Link href="/" className="block text-ivory/60 hover:text-ivory transition-colors text-sm uppercase tracking-widest">
                Home
              </Link>
              <Link href="/principles" className="block text-ivory/60 hover:text-ivory transition-colors text-sm uppercase tracking-widest">
                Principles
              </Link>
              <Link href="/capabilities" className="block text-ivory/60 hover:text-ivory transition-colors text-sm uppercase tracking-widest">
                Capabilities
              </Link>
              <Link href="/contact" className="block text-ivory/60 hover:text-ivory transition-colors text-sm uppercase tracking-widest">
                Contact
              </Link>
              <Link href="/approach" className="block text-ivory/60 hover:text-ivory transition-colors text-sm uppercase tracking-widest">
                Approach
              </Link>
            </nav>
          </div>
        </div>

        {/* Contact strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 border-t border-accent/10">
          <a
            href="mailto:hello@quintessence.com"
            className="flex items-center gap-3 text-ivory/60 hover:text-ivory transition-colors text-sm"
          >
            <Mail size={16} aria-hidden="true" />
            hello@quintessence.com
          </a>
          <p className="text-ivory/60 text-sm md:text-right">
            We reply within one business day.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-accent/20">
          <div className="text-xs text-ivory/60">
            © {currentYear} Quintessence. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
