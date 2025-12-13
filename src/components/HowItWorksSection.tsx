import { Wallet, ArrowLeftRight, CheckCircle } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      icon: Wallet,
      title: "Connect Your Wallet",
      description: "Connect with MetaMask, WalletConnect, Coinbase Wallet, or create a new ArbiterX wallet.",
      details: ["Multi-wallet support", "Secure connection", "One-click setup"],
    },
    {
      number: "02",
      icon: ArrowLeftRight,
      title: "Swap or Transfer",
      description: "Choose your asset, select destination chain, and enter the recipient address. We handle the rest.",
      details: ["Auto chain detection", "Best rate routing", "0.1% bridge fee"],
    },
    {
      number: "03",
      icon: CheckCircle,
      title: "Confirm & Done",
      description: "Review your transaction, confirm with one click, and get instant execution with secure confirmation.",
      details: ["Gasless option", "Real-time tracking", "Instant confirmation"],
    },
  ];

  return (
    <section id="how-it-works" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
            Three Simple Steps to{" "}
            <span className="gradient-text">Cross-Chain Freedom</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            No complex bridges, no manual swaps. Just connect, select, and send.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2" />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={step.number} className="relative group">
                {/* Step Card */}
                <div className="glass-card p-8 rounded-2xl hover-lift h-full">
                  {/* Step Number */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-5xl font-heading font-bold text-primary/20">
                      {step.number}
                    </span>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_30px_hsl(187_94%_43%_/_0.3)]">
                      <step.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-heading font-semibold mb-4 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Details */}
                  <ul className="space-y-2">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-6 w-12 h-12 items-center justify-center z-10">
                    <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Ready to experience seamless cross-chain transactions?
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold shadow-[0_4px_20px_hsl(187_94%_43%_/_0.4)] hover:shadow-[0_6px_30px_hsl(187_94%_43%_/_0.6)] hover:scale-105 transition-all duration-300">
            Start Trading Now
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
