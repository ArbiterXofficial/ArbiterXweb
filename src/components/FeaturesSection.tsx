import { Shield, RefreshCw, Smartphone, Code, Lock, Gauge } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure Wallet",
      description: "Send and receive assets safely with multi-party computation (MPC) and multi-signature security options.",
      highlights: ["Non-custodial keys", "Panic code freeze", "AES-256 encryption"],
    },
    {
      icon: RefreshCw,
      title: "Instant Swaps",
      description: "Swap ETH ↔ BNB ↔ SOL and more instantly with integrated DEX aggregators.",
      highlights: ["1inch integration", "PancakeSwap", "Jupiter & Uniswap V3"],
    },
    {
      icon: Smartphone,
      title: "User-Friendly Design",
      description: "Intuitive dashboard with portfolio overview and seamless mobile & desktop experience.",
      highlights: ["Real-time prices", "Transaction history", "Skeleton loaders"],
    },
    {
      icon: Code,
      title: "API & Developer Ready",
      description: "Robust backend APIs for developers with testnet support and comprehensive documentation.",
      highlights: ["TypeScript SDK", "Sandbox mode", "GitBook docs"],
    },
    {
      icon: Gauge,
      title: "Gasless Transactions",
      description: "Sign transactions without worrying about gas. We handle it with minimal fees.",
      highlights: ["5 free transfers", "Meta-transactions", "Relayer network"],
    },
    {
      icon: Lock,
      title: "Panic Code Security",
      description: "Instantly freeze your wallet if compromised. Your assets stay protected.",
      highlights: ["Instant freeze", "Recovery options", "24/7 protection"],
    },
  ];

  return (
    <section id="features" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
            Features That{" "}
            <span className="gradient-text">Empower Your Crypto Journey</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need for seamless cross-chain transactions, wrapped in a secure and intuitive interface.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative"
            >
              {/* Card */}
              <div className="glass-card p-8 rounded-2xl h-full hover-lift relative overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 shadow-[0_0_30px_hsl(187_94%_43%_/_0.3)] group-hover:shadow-[0_0_40px_hsl(187_94%_43%_/_0.5)] transition-shadow duration-300">
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-heading font-semibold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2">
                    {feature.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="px-3 py-1 rounded-full bg-secondary/80 text-xs text-muted-foreground"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
