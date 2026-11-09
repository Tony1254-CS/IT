import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Principles",
  description:
    "Scopes in writing, secure by default, documented handover — the commitments behind every engagement.",
};

export default function PrinciplesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
