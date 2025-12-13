import { CheckCircle, Circle, Clock } from "lucide-react";

const RoadmapSection = () => {
  const phases = [
    {
      phase: "Phase 1",
      title: "Wireframes & UX",
      status: "completed",
      items: [
        "Full Figma design system",
        "Component design",
        "User flow diagrams",
        "Clickable prototype",
      ],
    },
    {
      phase: "Phase 2",
      title: "System Architecture",
      status: "completed",
      items: [
        "Detailed architecture map",
        "Contract diagrams",
        "Relayer system overview",
        "API chart design",
      ],
    },
    {
      phase: "Phase 3",
      title: "Testnet MVP",
      status: "in-progress",
      items: [
        "Testnet-ready contracts",
        "Swap + cross-chain demo",
        "Gasless demonstration",
        "Minimal UI launch",
      ],
    },
    {
      phase: "Phase 4",
      title: "Core Development",
      status: "upcoming",
      items: [
        "Full wallet infrastructure",
        "Real bridge integration",
        "Production UI",
        "Panic code system",
      ],
    },
    {
      phase: "Phase 5",
      title: "Security & Docs",
      status: "upcoming",
      items: [
        "Contract audits",
        "90%+ test coverage",
        "GitBook documentation",
        "Security testing",
      ],
    },
    {
      phase: "Phase 6",
      title: "SDK Development",
      status: "upcoming",
      items: [
        "TypeScript SDK",
        "API authentication",
        "Sandbox mode",
        "Developer examples",
      ],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-chart-green" />;
      case "in-progress":
        return <Clock className="w-6 h-6 text-primary animate-pulse" />;
      default:
        return <Circle className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-chart-green/50 bg-chart-green/5";
      case "in-progress":
        return "border-primary/50 bg-primary/5";
      default:
        return "border-border bg-card/50";
    }
  };

  return (
    <section id="roadmap" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            Roadmap
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
            Our Journey to{" "}
            <span className="gradient-text">Launch</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Building the future of cross-chain transactions, one milestone at a time.
          </p>
        </div>

        {/* Roadmap Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {phases.map((phase, index) => (
            <div
              key={phase.phase}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] ${getStatusColor(
                phase.status
              )}`}
            >
              {/* Phase Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-primary">{phase.phase}</span>
                {getStatusIcon(phase.status)}
              </div>

              {/* Title */}
              <h3 className="text-xl font-heading font-semibold mb-4 text-foreground">
                {phase.title}
              </h3>

              {/* Items */}
              <ul className="space-y-3">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Status Badge */}
              <div className="mt-6 pt-4 border-t border-border/50">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                    phase.status === "completed"
                      ? "bg-chart-green/20 text-chart-green"
                      : phase.status === "in-progress"
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {phase.status === "completed" && "Completed"}
                  {phase.status === "in-progress" && "In Progress"}
                  {phase.status === "upcoming" && "Upcoming"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Join Beta CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col items-center glass-card px-12 py-8 rounded-2xl">
            <h3 className="text-2xl font-heading font-bold mb-2">Be an Early Adopter</h3>
            <p className="text-muted-foreground mb-6">Get exclusive access to our beta and shape the future of ArbiterX</p>
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold shadow-[0_4px_20px_hsl(187_94%_43%_/_0.4)] hover:shadow-[0_6px_30px_hsl(187_94%_43%_/_0.6)] hover:scale-105 transition-all duration-300">
              Join Beta Waitlist
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
