import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CryptoData {
  name: string;
  symbol: string;
  price: string;
  change: number;
  color: string;
}

const cryptoData: CryptoData[] = [
  { name: "Bitcoin", symbol: "BTC", price: "43,567.82", change: 2.34, color: "#F7931A" },
  { name: "Ethereum", symbol: "ETH", price: "2,345.67", change: -1.23, color: "#627EEA" },
  { name: "BNB", symbol: "BNB", price: "312.45", change: 0.87, color: "#F3BA2F" },
  { name: "Solana", symbol: "SOL", price: "98.32", change: 5.67, color: "#9945FF" },
];

const MarketChart = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartData, setChartData] = useState<number[]>([]);

  useEffect(() => {
    // Generate random chart data
    const generateData = () => {
      const data: number[] = [];
      let value = 50;
      for (let i = 0; i < 50; i++) {
        value += (Math.random() - 0.5) * 10;
        value = Math.max(20, Math.min(80, value));
        data.push(value);
      }
      return data;
    };
    setChartData(generateData());

    const interval = setInterval(() => {
      setChartData((prev) => {
        const newData = [...prev.slice(1)];
        let lastValue = newData[newData.length - 1];
        lastValue += (Math.random() - 0.5) * 10;
        lastValue = Math.max(20, Math.min(80, lastValue));
        newData.push(lastValue);
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const createPath = () => {
    if (chartData.length === 0) return "";
    const width = 400;
    const height = 120;
    const stepX = width / (chartData.length - 1);

    let path = `M 0 ${height - chartData[0]}`;
    for (let i = 1; i < chartData.length; i++) {
      const x = i * stepX;
      const y = height - chartData[i];
      const prevX = (i - 1) * stepX;
      const prevY = height - chartData[i - 1];
      const cpX = (prevX + x) / 2;
      path += ` C ${cpX} ${prevY}, ${cpX} ${y}, ${x} ${y}`;
    }
    return path;
  };

  const createAreaPath = () => {
    const linePath = createPath();
    if (!linePath) return "";
    return `${linePath} L 400 120 L 0 120 Z`;
  };

  return (
    <div className="glass-card p-6 lg:p-8 rounded-2xl animate-fade-up-delay-2">
      {/* Crypto Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {cryptoData.map((crypto, index) => (
          <button
            key={crypto.symbol}
            onClick={() => setActiveIndex(index)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
              activeIndex === index
                ? "bg-primary/20 border border-primary/50"
                : "bg-secondary/50 border border-transparent hover:border-border"
            }`}
          >
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: crypto.color }}
            />
            <span className="font-medium text-sm">{crypto.symbol}</span>
          </button>
        ))}
      </div>

      {/* Price Display */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
            ${cryptoData[activeIndex].price}
          </span>
          <span
            className={`flex items-center gap-1 text-sm font-medium ${
              cryptoData[activeIndex].change >= 0 ? "text-chart-green" : "text-chart-red"
            }`}
          >
            {cryptoData[activeIndex].change >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {cryptoData[activeIndex].change >= 0 ? "+" : ""}
            {cryptoData[activeIndex].change}%
          </span>
        </div>
        <span className="text-muted-foreground text-sm mt-1 block">
          {cryptoData[activeIndex].name} / USD
        </span>
      </div>

      {/* Chart */}
      <div className="relative h-32 lg:h-40">
        <svg
          viewBox="0 0 400 120"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(187 94% 43%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(187 94% 43%)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(187 94% 43%)" />
              <stop offset="100%" stopColor="hsl(217 91% 60%)" />
            </linearGradient>
          </defs>
          
          {/* Area fill */}
          <path
            d={createAreaPath()}
            fill="url(#chartGradient)"
            className="transition-all duration-500"
          />
          
          {/* Line */}
          <path
            d={createPath()}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            className="transition-all duration-500"
          />
          
          {/* Dot at the end */}
          {chartData.length > 0 && (
            <circle
              cx="400"
              cy={120 - chartData[chartData.length - 1]}
              r="4"
              fill="hsl(187 94% 43%)"
              className="animate-pulse-glow"
            />
          )}
        </svg>

        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border-t border-border/30" />
          ))}
        </div>
      </div>

      {/* Time labels */}
      <div className="flex justify-between mt-4 text-xs text-muted-foreground">
        <span>24h ago</span>
        <span>12h ago</span>
        <span>6h ago</span>
        <span>Now</span>
      </div>
    </div>
  );
};

export default MarketChart;
