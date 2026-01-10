import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Supported chains configuration
const CHAIN_CONFIG: Record<string, { chainId: number; name: string; rpcUrl: string; nativeCurrency: string }> = {
  ethereum: { chainId: 1, name: 'Ethereum', rpcUrl: 'https://eth.llamarpc.com', nativeCurrency: 'ETH' },
  bsc: { chainId: 56, name: 'BSC', rpcUrl: 'https://bsc-dataseed.binance.org', nativeCurrency: 'BNB' },
  polygon: { chainId: 137, name: 'Polygon', rpcUrl: 'https://polygon-rpc.com', nativeCurrency: 'MATIC' },
  arbitrum: { chainId: 42161, name: 'Arbitrum', rpcUrl: 'https://arb1.arbitrum.io/rpc', nativeCurrency: 'ETH' },
  optimism: { chainId: 10, name: 'Optimism', rpcUrl: 'https://mainnet.optimism.io', nativeCurrency: 'ETH' },
  avalanche: { chainId: 43114, name: 'Avalanche', rpcUrl: 'https://api.avax.network/ext/bc/C/rpc', nativeCurrency: 'AVAX' },
  base: { chainId: 8453, name: 'Base', rpcUrl: 'https://mainnet.base.org', nativeCurrency: 'ETH' },
};

// Token addresses for different chains (common tokens)
const TOKEN_ADDRESSES: Record<string, Record<string, string>> = {
  ethereum: {
    ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    DAI: '0x6B175474E89094C44Da98b954EesS3E3616C548',
  },
  bsc: {
    BNB: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    USDT: '0x55d398326f99059fF775485246999027B3197955',
    USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  },
  polygon: {
    MATIC: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    WMATIC: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  },
  arbitrum: {
    ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  },
};

interface SwapQuoteRequest {
  fromChain: string;
  toChain: string;
  fromToken: string;
  toToken: string;
  amount: string;
  userAddress: string;
  slippage?: number;
}

interface QuoteResponse {
  aggregator: string;
  fromAmount: string;
  toAmount: string;
  estimatedGas: string;
  route: string[];
  priceImpact: string;
  fee: string;
  executionTime: string;
}

// Get quote from 1inch API (Fusion mode for gasless)
async function get1inchQuote(
  chainId: number,
  fromToken: string,
  toToken: string,
  amount: string
): Promise<QuoteResponse | null> {
  try {
    const apiKey = Deno.env.get('ONEINCH_API_KEY');
    const baseUrl = `https://api.1inch.dev/swap/v6.0/${chainId}/quote`;
    
    const params = new URLSearchParams({
      src: fromToken,
      dst: toToken,
      amount: amount,
    });

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(`${baseUrl}?${params}`, { headers });
    
    if (!response.ok) {
      console.log('1inch API error:', await response.text());
      return null;
    }

    const data = await response.json();
    
    return {
      aggregator: '1inch',
      fromAmount: amount,
      toAmount: data.toAmount || data.dstAmount,
      estimatedGas: data.gas || '150000',
      route: data.protocols?.[0]?.map((p: any) => p.name) || ['Direct'],
      priceImpact: '0.1',
      fee: (parseFloat(amount) * 0.001).toString(),
      executionTime: '30s',
    };
  } catch (error) {
    console.error('1inch quote error:', error);
    return null;
  }
}

// Get quote from 0x API
async function get0xQuote(
  chainId: number,
  fromToken: string,
  toToken: string,
  amount: string
): Promise<QuoteResponse | null> {
  try {
    const apiKey = Deno.env.get('ZEROX_API_KEY');
    const chainNames: Record<number, string> = {
      1: 'ethereum',
      56: 'bsc',
      137: 'polygon',
      42161: 'arbitrum',
    };
    
    const chainName = chainNames[chainId] || 'ethereum';
    const baseUrl = `https://api.0x.org/swap/v1/quote`;
    
    const params = new URLSearchParams({
      sellToken: fromToken,
      buyToken: toToken,
      sellAmount: amount,
    });

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    if (apiKey) {
      headers['0x-api-key'] = apiKey;
    }

    const response = await fetch(`${baseUrl}?${params}`, { headers });
    
    if (!response.ok) {
      console.log('0x API error:', await response.text());
      return null;
    }

    const data = await response.json();
    
    return {
      aggregator: '0x',
      fromAmount: amount,
      toAmount: data.buyAmount,
      estimatedGas: data.estimatedGas || '150000',
      route: data.sources?.filter((s: any) => s.proportion > 0).map((s: any) => s.name) || ['Direct'],
      priceImpact: data.estimatedPriceImpact || '0.1',
      fee: (parseFloat(amount) * 0.001).toString(),
      executionTime: '30s',
    };
  } catch (error) {
    console.error('0x quote error:', error);
    return null;
  }
}

// Simulate cross-chain quote using LiFi or similar aggregator logic
async function getCrossChainQuote(
  fromChain: string,
  toChain: string,
  fromToken: string,
  toToken: string,
  amount: string,
  userAddress: string
): Promise<QuoteResponse | null> {
  try {
    // LiFi API for cross-chain swaps
    const baseUrl = 'https://li.quest/v1/quote';
    
    const fromChainId = CHAIN_CONFIG[fromChain.toLowerCase()]?.chainId || 1;
    const toChainId = CHAIN_CONFIG[toChain.toLowerCase()]?.chainId || 56;
    
    const fromTokenAddress = TOKEN_ADDRESSES[fromChain.toLowerCase()]?.[fromToken] || 
      '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
    const toTokenAddress = TOKEN_ADDRESSES[toChain.toLowerCase()]?.[toToken] || 
      '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

    const params = new URLSearchParams({
      fromChain: fromChainId.toString(),
      toChain: toChainId.toString(),
      fromToken: fromTokenAddress,
      toToken: toTokenAddress,
      fromAmount: amount,
      fromAddress: userAddress,
    });

    const response = await fetch(`${baseUrl}?${params}`, {
      headers: { 'Accept': 'application/json' },
    });
    
    if (!response.ok) {
      console.log('LiFi API response:', response.status);
      // Return simulated quote if API fails
      return getSimulatedCrossChainQuote(amount, fromToken, toToken);
    }

    const data = await response.json();
    
    return {
      aggregator: 'LiFi',
      fromAmount: amount,
      toAmount: data.estimate?.toAmount || (parseFloat(amount) * 0.98).toString(),
      estimatedGas: data.estimate?.gasCosts?.[0]?.amount || '250000',
      route: [data.toolDetails?.name || 'Bridge', 'Swap'],
      priceImpact: data.estimate?.priceImpact || '0.5',
      fee: (parseFloat(amount) * 0.003).toString(),
      executionTime: data.estimate?.executionDuration ? `${Math.ceil(data.estimate.executionDuration / 60)}m` : '5m',
    };
  } catch (error) {
    console.error('Cross-chain quote error:', error);
    return getSimulatedCrossChainQuote(amount, fromToken, toToken);
  }
}

function getSimulatedCrossChainQuote(amount: string, fromToken: string, toToken: string): QuoteResponse {
  // Simulated exchange rates
  const rates: Record<string, Record<string, number>> = {
    ETH: { BNB: 6.23, MATIC: 2100, SOL: 15.5, USDT: 2650, USDC: 2650 },
    BNB: { ETH: 0.16, MATIC: 337, SOL: 2.49, USDT: 425, USDC: 425 },
    MATIC: { ETH: 0.00048, BNB: 0.003, SOL: 0.007, USDT: 1.26, USDC: 1.26 },
    SOL: { ETH: 0.065, BNB: 0.4, MATIC: 135, USDT: 171, USDC: 171 },
    USDT: { ETH: 0.00038, BNB: 0.0024, MATIC: 0.79, SOL: 0.0058 },
    USDC: { ETH: 0.00038, BNB: 0.0024, MATIC: 0.79, SOL: 0.0058 },
  };

  const rate = rates[fromToken]?.[toToken] || 1;
  const toAmount = (parseFloat(amount) * rate * 0.997).toString(); // 0.3% slippage

  return {
    aggregator: 'ArbiterX',
    fromAmount: amount,
    toAmount,
    estimatedGas: '250000',
    route: ['Bridge', 'DEX Aggregator'],
    priceImpact: '0.3',
    fee: (parseFloat(amount) * 0.001).toString(),
    executionTime: '3-5m',
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();
    
    console.log(`Cross-chain swap action: ${action}`, params);

    switch (action) {
      case 'getQuote': {
        const { fromChain, toChain, fromToken, toToken, amount, userAddress } = params as SwapQuoteRequest;
        
        if (!fromChain || !toChain || !fromToken || !toToken || !amount) {
          return new Response(
            JSON.stringify({ error: 'Missing required parameters' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const quotes: QuoteResponse[] = [];
        const isCrossChain = fromChain.toLowerCase() !== toChain.toLowerCase();

        if (isCrossChain) {
          // Cross-chain swap - use bridge aggregator
          const crossChainQuote = await getCrossChainQuote(
            fromChain, toChain, fromToken, toToken, amount, userAddress || '0x0000000000000000000000000000000000000000'
          );
          if (crossChainQuote) quotes.push(crossChainQuote);
        } else {
          // Same-chain swap - use DEX aggregators
          const chainId = CHAIN_CONFIG[fromChain.toLowerCase()]?.chainId || 1;
          const fromTokenAddress = TOKEN_ADDRESSES[fromChain.toLowerCase()]?.[fromToken] || 
            '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
          const toTokenAddress = TOKEN_ADDRESSES[fromChain.toLowerCase()]?.[toToken] || 
            '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

          // Get quotes from multiple aggregators in parallel
          const [oneInchQuote, zeroXQuote] = await Promise.all([
            get1inchQuote(chainId, fromTokenAddress, toTokenAddress, amount),
            get0xQuote(chainId, fromTokenAddress, toTokenAddress, amount),
          ]);

          if (oneInchQuote) quotes.push(oneInchQuote);
          if (zeroXQuote) quotes.push(zeroXQuote);
        }

        // Always include simulated quote as fallback
        if (quotes.length === 0) {
          quotes.push(getSimulatedCrossChainQuote(amount, fromToken, toToken));
        }

        // Sort by best rate (highest toAmount)
        quotes.sort((a, b) => parseFloat(b.toAmount) - parseFloat(a.toAmount));

        return new Response(
          JSON.stringify({ 
            success: true, 
            isCrossChain,
            quotes,
            bestQuote: quotes[0],
            timestamp: Date.now(),
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'getSupportedChains': {
        return new Response(
          JSON.stringify({ 
            success: true, 
            chains: Object.entries(CHAIN_CONFIG).map(([key, config]) => ({
              id: key,
              ...config,
            })),
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'getSupportedTokens': {
        const { chain } = params;
        const tokens = TOKEN_ADDRESSES[chain?.toLowerCase()] || TOKEN_ADDRESSES.ethereum;
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            tokens: Object.entries(tokens).map(([symbol, address]) => ({
              symbol,
              address,
            })),
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error: unknown) {
    console.error('Error in cross-chain-swap function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
