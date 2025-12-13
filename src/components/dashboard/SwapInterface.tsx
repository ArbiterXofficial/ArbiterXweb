import { useState } from "react";
import { ArrowDownUp, ChevronDown, Settings, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Token {
  symbol: string;
  name: string;
  chain: string;
  icon: string;
  balance: number;
}

const tokens: Token[] = [
  { symbol: "ETH", name: "Ethereum", chain: "Ethereum", icon: "⟠", balance: 2.5431 },
  { symbol: "BNB", name: "BNB", chain: "BSC", icon: "◆", balance: 15.234 },
  { symbol: "SOL", name: "Solana", chain: "Solana", icon: "◎", balance: 45.123 },
  { symbol: "USDT", name: "Tether", chain: "Ethereum", icon: "$", balance: 1500.00 },
  { symbol: "MATIC", name: "Polygon", chain: "Polygon", icon: "⬡", balance: 1250.45 },
];

export function SwapInterface() {
  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);
  const [fromAmount, setFromAmount] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const exchangeRate = 6.23; // Mock rate
  const toAmount = fromAmount ? (parseFloat(fromAmount) * exchangeRate).toFixed(4) : "";
  const fee = fromAmount ? (parseFloat(fromAmount) * 0.001).toFixed(6) : "0";

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount("");
  };

  const TokenSelector = ({ 
    token, 
    showDropdown, 
    setShowDropdown, 
    onSelect,
    excludeToken 
  }: { 
    token: Token; 
    showDropdown: boolean;
    setShowDropdown: (show: boolean) => void;
    onSelect: (token: Token) => void;
    excludeToken: Token;
  }) => (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/80 hover:bg-background transition-colors"
      >
        <span className="text-xl">{token.icon}</span>
        <span className="font-medium">{token.symbol}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>
      {showDropdown && (
        <div className="absolute top-full mt-2 left-0 w-48 bg-card border border-border/50 rounded-lg shadow-xl z-50 overflow-hidden">
          {tokens
            .filter((t) => t.symbol !== excludeToken.symbol)
            .map((t) => (
              <button
                key={t.symbol}
                onClick={() => {
                  onSelect(t);
                  setShowDropdown(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors text-left"
              >
                <span className="text-xl">{t.icon}</span>
                <div>
                  <div className="font-medium">{t.symbol}</div>
                  <div className="text-xs text-muted-foreground">{t.chain}</div>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );

  return (
    <Card className="glass-card border-border/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ArrowDownUp className="h-5 w-5 text-primary" />
          Instant Swap
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* From Token */}
        <div className="p-4 rounded-xl bg-background/50 border border-border/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">From</span>
            <span className="text-sm text-muted-foreground">
              Balance: {fromToken.balance.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <TokenSelector
              token={fromToken}
              showDropdown={showFromDropdown}
              setShowDropdown={setShowFromDropdown}
              onSelect={setFromToken}
              excludeToken={toToken}
            />
            <Input
              type="number"
              placeholder="0.00"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="flex-1 text-right text-xl bg-transparent border-0 focus-visible:ring-0"
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-primary"
              onClick={() => setFromAmount((fromToken.balance * 0.5).toString())}
            >
              50%
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-primary"
              onClick={() => setFromAmount(fromToken.balance.toString())}
            >
              MAX
            </Button>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10 bg-card border-border/50 hover:bg-primary/20 hover:border-primary/50"
            onClick={handleSwapTokens}
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>

        {/* To Token */}
        <div className="p-4 rounded-xl bg-background/50 border border-border/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">To</span>
            <span className="text-sm text-muted-foreground">
              Balance: {toToken.balance.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <TokenSelector
              token={toToken}
              showDropdown={showToDropdown}
              setShowDropdown={setShowToDropdown}
              onSelect={setToToken}
              excludeToken={fromToken}
            />
            <Input
              type="text"
              placeholder="0.00"
              value={toAmount}
              readOnly
              className="flex-1 text-right text-xl bg-transparent border-0 focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Rate & Fee Info */}
        {fromAmount && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Exchange Rate</span>
              <span>1 {fromToken.symbol} = {exchangeRate} {toToken.symbol}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Network Fee</span>
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-primary" />
                {fee} {fromToken.symbol} (0.1%)
              </span>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <Button className="w-full h-12 bg-gradient-primary hover:opacity-90" disabled={!fromAmount}>
          {fromToken.chain !== toToken.chain ? "Swap & Bridge" : "Swap"}
        </Button>

        {/* Cross-chain indicator */}
        {fromToken.chain !== toToken.chain && (
          <div className="text-center text-sm text-primary/80 flex items-center justify-center gap-2">
            <Zap className="h-4 w-4" />
            Cross-chain swap: {fromToken.chain} → {toToken.chain}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
