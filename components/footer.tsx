"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

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
      <div className="max-w-[90rem] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
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
            <h3 className="font-display text-lg font-semibold text-ivory mb-6">Navigation</h3>
            <nav className="space-y-3">
              <Link href="/" className="block text-ivory/60 hover:text-ivory transition-colors text-sm uppercase tracking-widest">
                Home
              </Link>
              <Link href="/capabilities" className="block text-ivory/60 hover:text-ivory transition-colors text-sm uppercase tracking-widest">
                Capabilities
              </Link>
              <Link href="/approach" className="block text-ivory/60 hover:text-ivory transition-colors text-sm uppercase tracking-widest">
                Approach
              </Link>
              <Link href="/principles" className="block text-ivory/60 hover:text-ivory transition-colors text-sm uppercase tracking-widest">
                Principles
              </Link>
              <Link href="/contact" className="block text-ivory/60 hover:text-ivory transition-colors text-sm uppercase tracking-widest">
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-semibold text-ivory mb-6">Contact</h3>
            <div className="space-y-3 text-sm">
              <a href="mailto:hello@quintessence.com" className="flex items-center gap-3 text-ivory/60 hover:text-ivory transition-colors">
                <Mail size={16} />
                hello@quintessence.com
              </a>
              <a href="tel:+15551234567" className="flex items-center gap-3 text-ivory/60 hover:text-ivory transition-colors">
                <Phone size={16} />
                +1 (555) 123-4567
              </a>
              <div className="flex items-start gap-3 text-ivory/60">
                <MapPin size={16} className="mt-0.5" />
                <span>Downtown Business District, New York, NY</span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="font-display text-lg font-semibold text-ivory mb-6">Business Hours</h3>
            <div className="space-y-2 text-sm">
              <p className="text-ivory/60">Mon-Fri: 9am-6pm EST</p>
              <p className="text-ivory/60">Saturday: Closed</p>
              <p className="text-ivory/60">Sunday: Closed</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-accent/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-ivory/40">
              © {currentYear} Quintessence. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xs text-ivory/40 hover:text-ivory/60 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/" className="text-xs text-ivory/40 hover:text-ivory/60 transition-colors">
                Terms of Service
              </Link>
              <Link href="/" className="text-xs text-ivory/40 hover:text-ivory/60 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}