import { useState } from "react";
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, isAddress, formatUnits } from "viem";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownLeft, Copy, Check, QrCode, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function SendReceive() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [addressError, setAddressError] = useState("");

  const { sendTransaction, data: hash, isPending, error } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const validateAddress = (addr: string) => {
    if (!addr) {
      setAddressError("");
      return false;
    }
    if (!isAddress(addr)) {
      setAddressError("Invalid Ethereum address");
      return false;
    }
    if (addr.toLowerCase() === address?.toLowerCase()) {
      setAddressError("Cannot send to yourself");
      return false;
    }
    setAddressError("");
    return true;
  };

  const handleSend = async () => {
    if (!validateAddress(recipient)) return;
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      sendTransaction({
        to: recipient as `0x${string}`,
        value: parseEther(amount),
      });
    } catch (err) {
      toast.error("Transaction failed");
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Address copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shortAddress = address ? `${address.slice(0, 10)}...${address.slice(-8)}` : "";

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <Card className="max-w-md mx-auto glass-card">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Wallet Not Connected</h2>
              <p className="text-muted-foreground mb-4">Please connect your wallet to send or receive crypto.</p>
              <Button variant="hero" onClick={() => window.location.href = "/dashboard"}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Send & Receive | ArbiterX</title>
        <meta name="description" content="Send and receive cryptocurrency with ArbiterX" />
      </Helmet>
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-lg mx-auto">
          <Tabs defaultValue="send" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="send" className="gap-2">
                <ArrowUpRight className="h-4 w-4" />
                Send
              </TabsTrigger>
              <TabsTrigger value="receive" className="gap-2">
                <ArrowDownLeft className="h-4 w-4" />
                Receive
              </TabsTrigger>
            </TabsList>

            <TabsContent value="send">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Send Crypto</CardTitle>
                  <CardDescription>Transfer assets to any wallet address</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isSuccess ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Transaction Successful!</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Your transaction has been confirmed on the blockchain.
                      </p>
                      <Button variant="outline" asChild>
                        <a href={`https://etherscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer">
                          View on Explorer
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="recipient">Recipient Address</Label>
                        <Input
                          id="recipient"
                          placeholder="0x..."
                          value={recipient}
                          onChange={(e) => {
                            setRecipient(e.target.value);
                            validateAddress(e.target.value);
                          }}
                          className={addressError ? "border-destructive" : ""}
                        />
                        {addressError && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {addressError}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="amount">Amount</Label>
                          <span className="text-sm text-muted-foreground">
                            Balance: {balance ? `${parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)} ${balance.symbol}` : "..."}
                          </span>
                        </div>
                        <div className="relative">
                          <Input
                            id="amount"
                            type="number"
                            placeholder="0.0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 text-xs"
                            onClick={() => setAmount(balance ? formatUnits(balance.value, balance.decimals) : "0")}
                          >
                            MAX
                          </Button>
                        </div>
                      </div>

                      {error && (
                        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                          {error.message.includes("insufficient") ? "Insufficient balance" : "Transaction failed"}
                        </div>
                      )}

                      <Button
                        variant="hero"
                        className="w-full"
                        onClick={handleSend}
                        disabled={isPending || isConfirming || !recipient || !amount}
                      >
                        {isPending || isConfirming ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {isPending ? "Confirming..." : "Processing..."}
                          </>
                        ) : (
                          <>
                            <ArrowUpRight className="h-4 w-4 mr-2" />
                            Send {balance?.symbol || "ETH"}
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="receive">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Receive Crypto</CardTitle>
                  <CardDescription>Share your address to receive assets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="aspect-square max-w-[200px] mx-auto bg-white rounded-xl p-4 flex items-center justify-center">
                    <QrCode className="w-full h-full text-black" />
                  </div>

                  <div className="space-y-2">
                    <Label>Your Wallet Address</Label>
                    <div className="flex gap-2">
                      <Input value={shortAddress} readOnly className="font-mono text-sm" />
                      <Button variant="outline" size="icon" onClick={copyAddress}>
                        {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Note:</strong> Only send compatible assets to this address. 
                      Sending unsupported tokens may result in permanent loss.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
