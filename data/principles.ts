export interface Principle {
  title: string;
  description: string;
}

export const principles: Principle[] = [
  {
    title: "Scoped in writing",
    description:
      "Every deliverable, constraint, and interface boundary is defined in unambiguous prose before execution begins.",
  },
  {
    title: "Secure by default",
    description:
      "Hardened configurations, principle of least privilege, and zero-trust boundaries baked into the foundational layer.",
  },
  {
    title: "Documented handover",
    description:
      "Exhaustive architecture runbooks, system diagrams, and regression suites so your engineering team retains total ownership.",
  },
];
