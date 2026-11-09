"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/capabilities", label: "Capabilities" },
    { href: "/approach", label: "Approach" },
    { href: "/principles", label: "Principles" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 top-3 md:top-6 z-50 pointer-events-none"
    >
      <div className="mx-auto pointer-events-auto flex w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-[90rem]">
        {/* Full-width pill: wordmark left, links + CTA right. On phones the pill
            grows to two rows (wordmark / links+CTA) so no link is pushed off-screen. */}
        <div className="relative flex w-full flex-col md:flex-row md:items-center md:justify-between px-4 md:px-6 py-2.5 md:py-0 md:h-[4rem] rounded-[1.5rem] md:rounded-full border border-white/10 bg-background/70 backdrop-blur-xl backdrop-saturate-150 shadow-2xl">
          <div className="relative z-10 flex items-center justify-between md:justify-start">
            <Link
              href="/"
              className="font-display text-[clamp(1.125rem,2vw,1.5rem)] font-semibold tracking-[0.2em] text-ivory italic py-1"
            >
              Quintessence
            </Link>
            {/* Mobile-only CTA keeps the conversion path reachable without a burger menu */}
            <Link
              href="/contact"
              className="md:hidden flex h-9 items-center rounded-full border border-accent/30 bg-accent/5 px-4 text-accent text-xs font-medium uppercase tracking-widest"
            >
              Begin a project
            </Link>
          </div>

          <div className="relative z-10 mt-2 md:mt-0 flex flex-wrap items-center md:justify-end gap-x-5 md:gap-x-8 gap-y-2 text-mono text-xs uppercase tracking-widest">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex h-6 items-center transition-colors duration-300 ${
                  pathname === item.href ? "text-accent" : "text-ivory/70 hover:text-ivory"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="hidden md:flex h-9 items-center rounded-full border border-accent/30 bg-accent/5 px-4 text-accent text-xs font-medium uppercase tracking-widest transition-all hover:bg-accent hover:text-background"
            >
              Begin a project
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
