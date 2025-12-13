import { ArrowLeftRight, Wallet, Zap, Globe } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: ArrowLeftRight,
      title: "Cross-Chain Swaps",
      description: "Seamlessly swap assets between different blockchains without complex bridge operations.",
    },
    {
      icon: Wallet,
      title: "Secure Wallet",
      description: "Non-custodial wallet with panic code security and encrypted key management.",
    },
    {
      icon: Zap,
      title: "Instant Transactions",
      description: "Lightning-fast transaction processing with real-time confirmations.",
    },
    {
      icon: Globe,
      title: "Multi-Chain Support",
      description: "Support for ETH, BNB, SOL, BTC, Polygon and more chains coming soon.",
    },
  ];

  return (
    <section id="about" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      <div className="absolute top-1/2 left-0 w-1/2 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Text Content */}
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              About ArbiterX
            </span>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
              Simplifying{" "}
              <span className="gradient-text">Blockchain Interoperability</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              ArbiterX is a next-generation cross-chain wallet and instant swap platform. 
              Effortlessly move assets across blockchains (ETH ↔ BNB ↔ SOL) without bridges or complex steps.
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              Our protocol automatically handles the complexity of cross-chain transactions, 
              so you can focus on what matters - managing your portfolio and executing trades 
              with confidence and minimal fees.
            </p>

            {/* Key Points */}
            <div className="flex flex-wrap gap-4 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50">
                <div className="w-2 h-2 rounded-full bg-chart-green" />
                <span className="text-sm">0.1% Bridge Fee</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50">
                <div className="w-2 h-2 rounded-full bg-chart-green" />
                <span className="text-sm">5 Free Gasless Transfers</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50">
                <div className="w-2 h-2 rounded-full bg-chart-green" />
                <span className="text-sm">Non-Custodial</span>
              </div>
            </div>
          </div>

          {/* Right - Feature Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card p-6 rounded-2xl hover-lift group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
