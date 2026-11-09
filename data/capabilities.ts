export interface Capability {
  id: string;
  number: string;
  title: string;
  tags: string;
  description: string;
}

export const capabilities: Capability[] = [
  {
    id: "software-engineering",
    number: "01",
    title: "Software Engineering",
    tags: "Web systems, Mobile platforms, Distributed backend, Architecture",
    description:
      "Precision-engineered web and mobile architectures, distributed backends, and fault-tolerant infrastructure built to endure.",
  },
  {
    id: "applied-ai",
    number: "02",
    title: "Applied AI",
    tags: "LLM integration, Retrieval systems, Autonomous agents, Vision",
    description:
      "Deterministic reasoning pipelines, context-aware retrieval architectures, and domain-tuned models engineered for enterprise certainty.",
  },
  {
    id: "cybersecurity",
    number: "03",
    title: "Cybersecurity",
    tags: "Penetration testing, Code audit, Cloud hardening, Cryptography",
    description:
      "Adversarial security assessments, formal verification of critical paths, zero-trust network design, and defensive hardening.",
  },
  {
    id: "cloud-infrastructure",
    number: "04",
    title: "Cloud & Infrastructure",
    tags: "Multi-cloud, Kubernetes, CI/CD pipelines, Observability",
    description:
      "Immutable infrastructure as code, zero-downtime deployment topologies, and distributed telemetry built for mission-critical uptime.",
  },
  {
    id: "design-brand",
    number: "05",
    title: "Design & Brand",
    tags: "Interface systems, Brand identity, Motion design, Design systems",
    description:
      "Restrained interface craftsmanship, typographic discipline, and cohesive digital design languages that command authority.",
  },
  {
    id: "performance-growth",
    number: "06",
    title: "Performance & Scale",
    tags: "Latency reduction, Core Web Vitals, Database optimization, Telemetry",
    description:
      "Sub-millisecond latency tuning, database query profiling, and high-concurrency throughput optimization under severe load.",
  },
];
