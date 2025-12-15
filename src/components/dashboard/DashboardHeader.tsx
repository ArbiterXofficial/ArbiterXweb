import { Bell, Settings, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/WalletConnect";
import { toast } from "sonner";

export function DashboardHeader() {
  const { address, isConnected } = useAccount();
  const [copied, setCopied] = useState(false);
  const walletAddress = address || "0x0000000000000000000000000000000000000000";
  const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    toast.success("Address copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between pb-6 border-b border-border/30">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {isConnected ? (
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-muted-foreground">Connected</span>
            <button
              onClick={handleCopyAddress}
              className="flex items-center gap-1 px-2 py-1 rounded bg-background/50 hover:bg-background/80 transition-colors text-sm text-muted-foreground"
            >
              {shortAddress}
              {copied ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mt-1">Connect your wallet to get started</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <WalletConnect />
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
        </Button>
        <Link to="/settings">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
