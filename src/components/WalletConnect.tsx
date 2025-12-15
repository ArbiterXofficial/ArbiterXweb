import { useState } from "react";
import { useConnect, useDisconnect, useAccount, useBalance, useChainId } from "wagmi";
import { formatUnits } from "viem";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, Loader2, Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const formatBalance = (balance: { decimals: number; symbol: string; value: bigint } | undefined) => {
  if (!balance) return "...";
  return `${parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)} ${balance.symbol}`;
};

export function WalletConnect() {
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected, connector } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConnect = async (connector: any) => {
    try {
      connect({ connector });
      setIsOpen(false);
      toast.success("Wallet connected successfully!");
    } catch (error) {
      toast.error("Failed to connect wallet");
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.success("Wallet disconnected");
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Address copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  const getChainName = (id: number) => {
    const chains: Record<number, string> = {
      1: "Ethereum",
      11155111: "Sepolia",
      56: "BNB Chain",
      137: "Polygon",
    };
    return chains[id] || "Unknown";
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-card/50 border border-border/30">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-muted-foreground">{getChainName(chainId)}</span>
          <span className="text-sm font-medium">{formatBalance(balance)}</span>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Wallet className="h-4 w-4" />
              {shortAddress}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Wallet Connected</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/30">
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-mono text-sm">{shortAddress}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={copyAddress}>
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                  <p className="text-sm text-muted-foreground">Network</p>
                  <p className="font-medium">{getChainName(chainId)}</p>
                </div>
                <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className="font-medium">{formatBalance(balance)}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2" asChild>
                  <a href={`https://etherscan.io/address/${address}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    View on Explorer
                  </a>
                </Button>
                <Button variant="destructive" className="flex-1 gap-2" onClick={handleDisconnect}>
                  <LogOut className="h-4 w-4" />
                  Disconnect
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="hero" size="sm" className="gap-2">
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect your wallet</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              variant="outline"
              className="w-full justify-start gap-3 h-14 text-left"
              disabled={isPending}
              onClick={() => handleConnect(connector)}
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-primary" />
                </div>
              )}
              <div>
                <p className="font-medium">{connector.name}</p>
                <p className="text-xs text-muted-foreground">
                  {connector.name === "Injected" ? "Browser wallet" : "Connect via QR code"}
                </p>
              </div>
            </Button>
          ))}
        </div>
        <p className="text-xs text-center text-muted-foreground">
          By connecting, you agree to our Terms of Service and Privacy Policy
        </p>
      </DialogContent>
    </Dialog>
  );
}
