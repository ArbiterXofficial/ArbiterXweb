import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Token {
  symbol: string;
  name: string;
  chain: string;
  icon: string;
  balance: number;
  address?: string;
}

export interface SwapQuote {
  aggregator: string;
  fromAmount: string;
  toAmount: string;
  estimatedGas: string;
  route: string[];
  priceImpact: string;
  fee: string;
  executionTime: string;
}

export interface QuoteResponse {
  success: boolean;
  isCrossChain: boolean;
  quotes: SwapQuote[];
  bestQuote: SwapQuote;
  timestamp: number;
}

export function useSwapQuote() {
  const [isLoading, setIsLoading] = useState(false);
  const [quoteData, setQuoteData] = useState<QuoteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getQuote = useCallback(async (
    fromToken: Token,
    toToken: Token,
    amount: string,
    userAddress?: string
  ) => {
    if (!amount || parseFloat(amount) <= 0) {
      setQuoteData(null);
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert amount to wei/smallest unit (assuming 18 decimals for simplicity)
      const amountInWei = (parseFloat(amount) * 1e18).toString();

      const { data, error: fnError } = await supabase.functions.invoke('cross-chain-swap', {
        body: {
          action: 'getQuote',
          fromChain: fromToken.chain,
          toChain: toToken.chain,
          fromToken: fromToken.symbol,
          toToken: toToken.symbol,
          amount: amountInWei,
          userAddress: userAddress || '0x0000000000000000000000000000000000000000',
        },
      });

      if (fnError) {
        throw fnError;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to get quote');
      }

      // Convert amounts back from wei
      const processedData: QuoteResponse = {
        ...data,
        quotes: data.quotes.map((q: SwapQuote) => ({
          ...q,
          fromAmount: (parseFloat(q.fromAmount) / 1e18).toFixed(6),
          toAmount: (parseFloat(q.toAmount) / 1e18).toFixed(6),
          fee: (parseFloat(q.fee) / 1e18).toFixed(6),
        })),
        bestQuote: {
          ...data.bestQuote,
          fromAmount: (parseFloat(data.bestQuote.fromAmount) / 1e18).toFixed(6),
          toAmount: (parseFloat(data.bestQuote.toAmount) / 1e18).toFixed(6),
          fee: (parseFloat(data.bestQuote.fee) / 1e18).toFixed(6),
        },
      };

      setQuoteData(processedData);
      return processedData;
    } catch (err: any) {
      console.error('Quote error:', err);
      setError(err.message || 'Failed to fetch quote');
      toast({
        title: 'Quote Error',
        description: err.message || 'Failed to fetch swap quote',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const clearQuote = useCallback(() => {
    setQuoteData(null);
    setError(null);
  }, []);

  return {
    getQuote,
    clearQuote,
    isLoading,
    quoteData,
    error,
  };
}
