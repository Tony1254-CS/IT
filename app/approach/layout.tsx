import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Approach",
  description:
    "Deliberate progress, not rapid iteration — a four-step process from insight to implementation.",
  alternates: {
    canonical: "/approach",
  },
};

export default function ApproachLayout({ children }: { children: ReactNode }) {
  return children;
}
