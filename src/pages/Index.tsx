import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import RoadmapSection from "@/components/RoadmapSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>ArbiterX – Cross-Chain Wallet & Instant Swap Protocol</title>
        <meta
          name="description"
          content="Send, receive, and swap cryptocurrencies across multiple blockchains seamlessly. Experience gasless transactions with ArbiterX's next-generation cross-chain wallet."
        />
        <meta property="og:title" content="ArbiterX – Cross-Chain Wallet & Instant Swap" />
        <meta
          property="og:description"
          content="The next-generation cross-chain wallet and instant swap platform. Move assets across ETH, BNB, SOL, and more with 0.1% fees."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://arbiterx.io" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <FeaturesSection />
          <HowItWorksSection />
          <RoadmapSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
