import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight, ExternalLink, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type TransactionType = "send" | "receive" | "swap";
type TransactionStatus = "completed" | "pending" | "failed";

interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  fromToken: string;
  toToken?: string;
  amount: number;
  toAmount?: number;
  fromChain: string;
  toChain?: string;
  address: string;
  timestamp: Date;
  txHash: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "swap",
    status: "completed",
    fromToken: "ETH",
    toToken: "BNB",
    amount: 0.5,
    toAmount: 3.12,
    fromChain: "Ethereum",
    toChain: "BSC",
    address: "0x1234...5678",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    txHash: "0xabc...def",
  },
  {
    id: "2",
    type: "send",
    status: "completed",
    fromToken: "SOL",
    amount: 10,
    fromChain: "Solana",
    address: "7nYB...9kL2",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    txHash: "4xyz...789",
  },
  {
    id: "3",
    type: "receive",
    status: "completed",
    fromToken: "USDT",
    amount: 500,
    fromChain: "Ethereum",
    address: "0x9876...4321",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    txHash: "0xdef...123",
  },
  {
    id: "4",
    type: "swap",
    status: "pending",
    fromToken: "MATIC",
    toToken: "ETH",
    amount: 250,
    toAmount: 0.125,
    fromChain: "Polygon",
    toChain: "Ethereum",
    address: "0xabcd...efgh",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    txHash: "0x456...789",
  },
  {
    id: "5",
    type: "send",
    status: "failed",
    fromToken: "BNB",
    amount: 2.5,
    fromChain: "BSC",
    address: "0x5555...6666",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    txHash: "0x999...111",
  },
];

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function getTypeIcon(type: TransactionType) {
  switch (type) {
    case "send":
      return <ArrowUpRight className="h-4 w-4" />;
    case "receive":
      return <ArrowDownLeft className="h-4 w-4" />;
    case "swap":
      return <ArrowLeftRight className="h-4 w-4" />;
  }
}

function getTypeColor(type: TransactionType) {
  switch (type) {
    case "send":
      return "text-orange-400 bg-orange-400/20";
    case "receive":
      return "text-emerald-400 bg-emerald-400/20";
    case "swap":
      return "text-primary bg-primary/20";
  }
}

function getStatusIcon(status: TransactionStatus) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-400 animate-pulse" />;
    case "failed":
      return <XCircle className="h-4 w-4 text-red-400" />;
  }
}

function getStatusBadge(status: TransactionStatus) {
  switch (status) {
    case "completed":
      return <Badge variant="outline" className="border-emerald-400/50 text-emerald-400 text-xs">Completed</Badge>;
    case "pending":
      return <Badge variant="outline" className="border-yellow-400/50 text-yellow-400 text-xs">Pending</Badge>;
    case "failed":
      return <Badge variant="outline" className="border-red-400/50 text-red-400 text-xs">Failed</Badge>;
  }
}

export function TransactionHistory() {
  return (
    <Card className="glass-card border-border/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors group"
            >
              <div className="flex items-center gap-4">
                {/* Type Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(tx.type)}`}>
                  {getTypeIcon(tx.type)}
                </div>
                
                {/* Transaction Details */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{tx.type}</span>
                    {getStatusIcon(tx.status)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tx.type === "swap" ? (
                      <span>
                        {tx.amount} {tx.fromToken} → {tx.toAmount} {tx.toToken}
                        {tx.fromChain !== tx.toChain && (
                          <span className="text-primary/80 ml-1">
                            ({tx.fromChain} → {tx.toChain})
                          </span>
                        )}
                      </span>
                    ) : (
                      <span>
                        {tx.amount} {tx.fromToken} on {tx.fromChain}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  {getStatusBadge(tx.status)}
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatTimeAgo(tx.timestamp)}
                  </div>
                </div>
                <a
                  href={`https://etherscan.io/tx/${tx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-primary/10"
                >
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <button className="w-full mt-4 py-3 text-center text-sm text-primary hover:text-primary/80 transition-colors">
          View All Transactions →
        </button>
      </CardContent>
    </Card>
  );
}
