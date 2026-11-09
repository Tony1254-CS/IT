export interface ApproachStep {
  step: string;
  title: string;
  description: string;
}

export const approachSteps: ApproachStep[] = [
  {
    step: "01",
    title: "Discover",
    description:
      "Deep technical reconnaissance and architectural audit to uncover core constraints before writing a single line of code.",
  },
  {
    step: "02",
    title: "Define",
    description:
      "Formal specifications, data contracts, and threat models agreed in writing to guarantee absolute alignment on delivery.",
  },
  {
    step: "03",
    title: "Build",
    description:
      "Disciplined implementation backed by automated verification, strict type checking, and measurable performance benchmarks.",
  },
  {
    step: "04",
    title: "Sustain",
    description:
      "Continuous verification, automated telemetry, and rigorous documentation ensuring long-term architectural integrity.",
  },
];
