import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Capabilities",
  description:
    "Software engineering, applied AI, cybersecurity, cloud and design — built for companies that expect more.",
  alternates: {
    canonical: "/capabilities",
  },
};

export default function CapabilitiesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
