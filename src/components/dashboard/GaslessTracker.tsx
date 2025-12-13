import { Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function GaslessTracker() {
  const used = 2;
  const total = 5;
  const remaining = total - used;
  const percentage = (remaining / total) * 100;

  return (
    <Card className="glass-card border-border/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="h-5 w-5 text-primary" />
          Gasless Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Remaining this month</span>
            <span className="font-medium text-primary">{remaining} / {total}</span>
          </div>
          <Progress value={percentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Free gasless transfers reset monthly. Upgrade for unlimited gasless transactions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
