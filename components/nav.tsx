"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/capabilities", label: "Capabilities" },
    { href: "/approach", label: "Approach" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed inset-x-0 top-6 z-50 pointer-events-none">
      <div className="mx-auto flex w-[calc(100%-4rem)] max-w-[144rem] pointer-events-auto">
        <div className="relative flex items-center justify-between w-full">
          <div className="relative flex h-[4rem] items-center justify-between px-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl backdrop-saturate-150 shadow-2xl">
            <span className="relative z-10 flex items-center gap-2">
              <span className="font-display text-[clamp(1.25rem,2.5vw,2rem)] font-semibold tracking-[0.35em] text-ivory italic">
                Quintessence
              </span>
            </span>
            <div className="relative z-10 flex items-center gap-8 text-mono text-xs uppercase tracking-widest opacity-70">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative hover:opacity-100 transition-opacity duration-300 ${
                    pathname === item.href ? "text-accent" : "text-ivory"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="relative z-10 flex h-9 w-auto items-center justify-center rounded-full border border-accent/30 bg-accent/5 px-4 text-accent text-xs font-medium uppercase tracking-widest transition-all hover:bg-accent hover:text-background"
              >
                Begin a project
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
