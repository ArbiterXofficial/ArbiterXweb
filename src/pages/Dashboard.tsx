import { Helmet } from "react-helmet-async";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { WalletOverview } from "@/components/dashboard/WalletOverview";
import { SwapInterface } from "@/components/dashboard/SwapInterface";
import { TransactionHistory } from "@/components/dashboard/TransactionHistory";
import { GaslessTracker } from "@/components/dashboard/GaslessTracker";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <>
      <Helmet>
        <title>Dashboard | ArbiterX</title>
        <meta name="description" content="Manage your crypto portfolio, swap tokens, and track transactions across multiple blockchains." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 container max-w-7xl mx-auto px-4 py-6">
          {/* Back Link */}
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          {/* Header */}
          <DashboardHeader />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left Column - Wallet Overview */}
            <div className="lg:col-span-2 space-y-6">
              <WalletOverview />
              <TransactionHistory />
            </div>

            {/* Right Column - Swap & Gasless */}
            <div className="space-y-6">
              <SwapInterface />
              <GaslessTracker />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
