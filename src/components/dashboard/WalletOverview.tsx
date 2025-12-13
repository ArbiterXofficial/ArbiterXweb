import { Wallet, TrendingUp, TrendingDown, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TokenBalance {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change24h: number;
  chain: string;
  icon: string;
}

const mockBalances: TokenBalance[] = [
  { symbol: "ETH", name: "Ethereum", balance: 2.5431, value: 4521.23, change24h: 2.34, chain: "Ethereum", icon: "⟠" },
  { symbol: "BNB", name: "BNB", balance: 15.234, value: 3456.78, change24h: -1.23, chain: "BSC", icon: "◆" },
  { symbol: "SOL", name: "Solana", balance: 45.123, value: 2890.45, change24h: 5.67, chain: "Solana", icon: "◎" },
  { symbol: "BTC", name: "Bitcoin", balance: 0.0523, value: 2234.56, change24h: 1.89, chain: "Bitcoin", icon: "₿" },
  { symbol: "MATIC", name: "Polygon", balance: 1250.45, value: 1125.40, change24h: -0.45, chain: "Polygon", icon: "⬡" },
];

export function WalletOverview() {
  const [showBalances, setShowBalances] = useState(true);
  
  const totalValue = mockBalances.reduce((acc, token) => acc + token.value, 0);
  const totalChange = mockBalances.reduce((acc, token) => acc + (token.value * token.change24h / 100), 0);
  const totalChangePercent = (totalChange / totalValue) * 100;

  return (
    <div className="space-y-6">
      {/* Total Portfolio Value */}
      <Card className="glass-card border-border/30">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Portfolio Value
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowBalances(!showBalances)}
            className="h-8 w-8"
          >
            {showBalances ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-foreground">
              {showBalances ? `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "••••••"}
            </span>
            <div className={`flex items-center gap-1 text-sm ${totalChangePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {totalChangePercent >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{totalChangePercent >= 0 ? '+' : ''}{totalChangePercent.toFixed(2)}%</span>
              <span className="text-muted-foreground ml-1">24h</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Token Balances */}
      <Card className="glass-card border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Your Assets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockBalances.map((token) => (
              <div
                key={token.symbol}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                    {token.icon}
                  </div>
                  <div>
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-sm text-muted-foreground">{token.chain}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {showBalances ? token.balance.toLocaleString('en-US', { maximumFractionDigits: 4 }) : "••••"}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">
                      {showBalances ? `$${token.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : "••••"}
                    </span>
                    <span className={token.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
