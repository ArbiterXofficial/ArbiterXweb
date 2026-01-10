import { useState, useEffect, useCallback } from "react";
import { ArrowDownUp, ChevronDown, Settings, Zap, RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSwapQuote, Token, SwapQuote } from "@/hooks/useSwapQuote";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/hooks/use-toast";

const tokens: Token[] = [
  { symbol: "ETH", name: "Ethereum", chain: "Ethereum", icon: "⟠", balance: 2.5431 },
  { symbol: "BNB", name: "BNB", chain: "BSC", icon: "◆", balance: 15.234 },
  { symbol: "SOL", name: "Solana", chain: "Solana", icon: "◎", balance: 45.123 },
  { symbol: "USDT", name: "Tether", chain: "Ethereum", icon: "$", balance: 1500.00 },
  { symbol: "USDC", name: "USD Coin", chain: "Ethereum", icon: "$", balance: 2500.00 },
  { symbol: "MATIC", name: "Polygon", chain: "Polygon", icon: "⬡", balance: 1250.45 },
  { symbol: "AVAX", name: "Avalanche", chain: "Avalanche", icon: "▲", balance: 25.67 },
];

export function SwapInterface() {
  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);
  const [fromAmount, setFromAmount] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<SwapQuote | null>(null);
  
  const { toast } = useToast();
  const { getQuote, isLoading, quoteData, clearQuote } = useSwapQuote();
  const debouncedAmount = useDebounce(fromAmount, 500);

  // Fetch quote when amount or tokens change
  useEffect(() => {
    if (debouncedAmount && parseFloat(debouncedAmount) > 0) {
      getQuote(fromToken, toToken, debouncedAmount);
    } else {
      clearQuote();
    }
  }, [debouncedAmount, fromToken, toToken, getQuote, clearQuote]);

  // Update selected quote when quote data changes
  useEffect(() => {
    if (quoteData?.bestQuote) {
      setSelectedQuote(quoteData.bestQuote);
    } else {
      setSelectedQuote(null);
    }
  }, [quoteData]);

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount("");
    clearQuote();
  };

  const handleRefreshQuote = useCallback(() => {
    if (fromAmount && parseFloat(fromAmount) > 0) {
      getQuote(fromToken, toToken, fromAmount);
    }
  }, [fromAmount, fromToken, toToken, getQuote]);

  const handleSwap = async () => {
    if (!selectedQuote) {
      toast({
        title: "No Quote",
        description: "Please enter an amount to get a quote first",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Swap Initiated",
      description: `Swapping ${fromAmount} ${fromToken.symbol} for ~${selectedQuote.toAmount} ${toToken.symbol}`,
    });

    // In a real implementation, this would call the wallet to sign and execute the transaction
    console.log("Executing swap with quote:", selectedQuote);
  };

  const isCrossChain = fromToken.chain !== toToken.chain;
  const toAmount = selectedQuote?.toAmount || "";
  const fee = selectedQuote?.fee || "0";
  const exchangeRate = fromAmount && toAmount && parseFloat(fromAmount) > 0
    ? (parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(4)
    : "0";

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
        <div className="text-left">
          <span className="font-medium">{token.symbol}</span>
          <span className="text-xs text-muted-foreground ml-1">({token.chain})</span>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>
      {showDropdown && (
        <div className="absolute top-full mt-2 left-0 w-56 bg-card border border-border/50 rounded-lg shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto">
          {tokens
            .filter((t) => t.symbol !== excludeToken.symbol || t.chain !== excludeToken.chain)
            .map((t) => (
              <button
                key={`${t.symbol}-${t.chain}`}
                onClick={() => {
                  onSelect(t);
                  setShowDropdown(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors text-left"
              >
                <span className="text-xl">{t.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{t.symbol}</div>
                  <div className="text-xs text-muted-foreground">{t.chain}</div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  {t.balance.toLocaleString()}
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
          {isCrossChain && (
            <Badge variant="secondary" className="ml-2 text-xs">
              Cross-Chain
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={handleRefreshQuote}
                  disabled={isLoading || !fromAmount}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh Quote</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Settings Panel */}
        {showSettings && (
          <div className="p-3 rounded-lg bg-background/50 border border-border/30 space-y-2">
            <div className="text-sm font-medium">Slippage Tolerance</div>
            <div className="flex gap-2">
              {[0.1, 0.5, 1.0].map((val) => (
                <Button
                  key={val}
                  variant={slippage === val ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSlippage(val)}
                >
                  {val}%
                </Button>
              ))}
              <Input
                type="number"
                value={slippage}
                onChange={(e) => setSlippage(parseFloat(e.target.value) || 0.5)}
                className="w-20 h-8 text-center"
                step={0.1}
              />
            </div>
          </div>
        )}

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
            <div className="flex-1 text-right">
              {isLoading ? (
                <div className="flex items-center justify-end gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Getting quote...</span>
                </div>
              ) : (
                <Input
                  type="text"
                  placeholder="0.00"
                  value={toAmount}
                  readOnly
                  className="text-right text-xl bg-transparent border-0 focus-visible:ring-0"
                />
              )}
            </div>
          </div>
        </div>

        {/* Quote Sources */}
        {quoteData && quoteData.quotes.length > 1 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Available Routes</div>
            <div className="space-y-1">
              {quoteData.quotes.slice(0, 3).map((quote, idx) => (
                <button
                  key={`${quote.aggregator}-${idx}`}
                  onClick={() => setSelectedQuote(quote)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg border transition-colors ${
                    selectedQuote?.aggregator === quote.aggregator
                      ? 'border-primary bg-primary/10'
                      : 'border-border/30 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {quote.aggregator}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      via {quote.route.join(' → ')}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{parseFloat(quote.toAmount).toFixed(4)}</div>
                    <div className="text-xs text-muted-foreground">~{quote.executionTime}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Rate & Fee Info */}
        {selectedQuote && fromAmount && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Exchange Rate</span>
              <span>1 {fromToken.symbol} = {exchangeRate} {toToken.symbol}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Price Impact</span>
              <span className={parseFloat(selectedQuote.priceImpact) > 1 ? 'text-warning' : ''}>
                {selectedQuote.priceImpact}%
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Network Fee</span>
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-primary" />
                {fee} {fromToken.symbol} (0.1%)
              </span>
            </div>
            {selectedQuote.aggregator && (
              <div className="flex justify-between text-muted-foreground">
                <span>Aggregator</span>
                <Badge variant="secondary" className="text-xs">
                  {selectedQuote.aggregator}
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Swap Button */}
        <Button 
          className="w-full h-12 bg-gradient-primary hover:opacity-90" 
          disabled={!fromAmount || isLoading || !selectedQuote}
          onClick={handleSwap}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Getting Best Rate...
            </>
          ) : isCrossChain ? (
            "Swap & Bridge"
          ) : (
            "Swap"
          )}
        </Button>

        {/* Cross-chain indicator */}
        {isCrossChain && (
          <div className="text-center text-sm text-primary/80 flex items-center justify-center gap-2">
            <Zap className="h-4 w-4" />
            Cross-chain swap: {fromToken.chain} → {toToken.chain}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Cross-chain swaps use bridge protocols to transfer assets between blockchains.
                  This may take 3-15 minutes to complete.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
