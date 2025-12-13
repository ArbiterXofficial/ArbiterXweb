import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, RefreshCw } from "lucide-react";
import MarketChart from "./MarketChart";

const HeroSection = () => {
  const stats = [
    { value: "$2.5B+", label: "Trading Volume" },
    { value: "150K+", label: "Active Users" },
    { value: "5+", label: "Blockchains" },
    { value: "0.1%", label: "Bridge Fee" },
  ];

  return (
    <section className="relative min-h-screen pt-24 lg:pt-32 pb-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-up">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Cross-Chain Made Simple</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold leading-tight mb-6 animate-fade-up-delay-1">
              <span className="text-foreground">Cross-Chain</span>
              <br />
              <span className="gradient-text">Wallet & Instant</span>
              <br />
              <span className="text-foreground">Swap Protocol</span>
            </h1>

            {/* Description */}
            <p className="text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 animate-fade-up-delay-2">
              Send, receive, and swap cryptocurrencies across multiple blockchains seamlessly. 
              Experience the future of decentralized finance with gasless transactions.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up-delay-3">
              <Button variant="hero" size="xl" className="gap-2">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="hero-outline" size="xl" className="gap-2">
                Learn More
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>Non-Custodial</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="w-4 h-4 text-primary" />
                <span>Gasless Transfers</span>
              </div>
            </div>
          </div>

          {/* Right Content - Chart */}
          <div className="relative">
            <MarketChart />
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 glass-card p-4 rounded-xl animate-float hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-primary-foreground font-bold">
                  B
                </div>
                <div>
                  <div className="text-sm font-medium">BTC → ETH</div>
                  <div className="text-xs text-chart-green">+2.34%</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 glass-card p-4 rounded-xl animate-float hidden lg:block" style={{ animationDelay: "1s" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-primary-foreground font-bold">
                  S
                </div>
                <div>
                  <div className="text-sm font-medium">SOL → BNB</div>
                  <div className="text-xs text-chart-green">Gasless ✓</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="glass-card p-6 rounded-xl text-center hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-2xl lg:text-3xl font-heading font-bold gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
