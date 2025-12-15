import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Lock, 
  Bell, 
  Palette, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  CheckCircle2,
  Moon,
  Sun,
  Smartphone,
  Key,
  Fingerprint
} from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [panicCode, setPanicCode] = useState("");
  const [confirmPanicCode, setConfirmPanicCode] = useState("");
  const [showPanicCode, setShowPanicCode] = useState(false);
  const [isPanicCodeSet, setIsPanicCodeSet] = useState(false);
  
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    emailAlerts: false,
    twoFactor: false,
    biometrics: false,
    autoLock: true,
    hideBalances: false,
  });

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success(`${key.replace(/([A-Z])/g, ' $1').trim()} ${!settings[key] ? 'enabled' : 'disabled'}`);
  };

  const handleSetPanicCode = () => {
    if (panicCode.length < 6) {
      toast.error("Panic code must be at least 6 characters");
      return;
    }
    if (panicCode !== confirmPanicCode) {
      toast.error("Panic codes do not match");
      return;
    }
    setIsPanicCodeSet(true);
    setPanicCode("");
    setConfirmPanicCode("");
    toast.success("Panic code set successfully! Your wallet can now be instantly frozen if compromised.");
  };

  const handleTriggerPanic = () => {
    toast.error("PANIC MODE ACTIVATED - Wallet frozen!", {
      description: "All transactions have been blocked. Contact support to recover access.",
      duration: 10000,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Settings | ArbiterX</title>
        <meta name="description" content="Manage your ArbiterX wallet settings and security" />
      </Helmet>
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground mb-8">Manage your wallet preferences and security</p>

          <Tabs defaultValue="security" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="security" className="gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="security" className="space-y-6">
              {/* Panic Code Section */}
              <Card className="glass-card border-destructive/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    Panic Code
                  </CardTitle>
                  <CardDescription>
                    Set up an emergency code to instantly freeze your wallet if compromised
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isPanicCodeSet ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        <div>
                          <p className="font-medium text-emerald-400">Panic Code Active</p>
                          <p className="text-sm text-muted-foreground">Your wallet is protected</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setIsPanicCodeSet(false)} className="flex-1">
                          Change Code
                        </Button>
                        <Button variant="destructive" onClick={handleTriggerPanic} className="flex-1">
                          Trigger Panic
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="panicCode">Create Panic Code</Label>
                        <div className="relative">
                          <Input
                            id="panicCode"
                            type={showPanicCode ? "text" : "password"}
                            placeholder="Enter 6+ character code"
                            value={panicCode}
                            onChange={(e) => setPanicCode(e.target.value)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                            onClick={() => setShowPanicCode(!showPanicCode)}
                          >
                            {showPanicCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPanicCode">Confirm Panic Code</Label>
                        <Input
                          id="confirmPanicCode"
                          type={showPanicCode ? "text" : "password"}
                          placeholder="Confirm your code"
                          value={confirmPanicCode}
                          onChange={(e) => setConfirmPanicCode(e.target.value)}
                        />
                      </div>
                      <Button variant="hero" className="w-full" onClick={handleSetPanicCode}>
                        <Lock className="h-4 w-4 mr-2" />
                        Set Panic Code
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Security Options */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Security Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/30">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Switch checked={settings.twoFactor} onCheckedChange={() => handleSettingChange("twoFactor")} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/30">
                    <div className="flex items-center gap-3">
                      <Fingerprint className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Biometric Login</p>
                        <p className="text-sm text-muted-foreground">Use fingerprint or face ID</p>
                      </div>
                    </div>
                    <Switch checked={settings.biometrics} onCheckedChange={() => handleSettingChange("biometrics")} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/30">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Auto-Lock</p>
                        <p className="text-sm text-muted-foreground">Lock wallet after 5 minutes of inactivity</p>
                      </div>
                    </div>
                    <Switch checked={settings.autoLock} onCheckedChange={() => handleSettingChange("autoLock")} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Theme & Display
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/30">
                    <div className="flex items-center gap-3">
                      {settings.darkMode ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                      </div>
                    </div>
                    <Switch checked={settings.darkMode} onCheckedChange={() => handleSettingChange("darkMode")} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/30">
                    <div className="flex items-center gap-3">
                      {settings.hideBalances ? <EyeOff className="h-5 w-5 text-primary" /> : <Eye className="h-5 w-5 text-primary" />}
                      <div>
                        <p className="font-medium">Hide Balances</p>
                        <p className="text-sm text-muted-foreground">Hide portfolio values for privacy</p>
                      </div>
                    </div>
                    <Switch checked={settings.hideBalances} onCheckedChange={() => handleSettingChange("hideBalances")} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/30">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive alerts for transactions</p>
                      </div>
                    </div>
                    <Switch checked={settings.notifications} onCheckedChange={() => handleSettingChange("notifications")} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/30">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Email Alerts</p>
                        <p className="text-sm text-muted-foreground">Get notified via email for important events</p>
                      </div>
                    </div>
                    <Switch checked={settings.emailAlerts} onCheckedChange={() => handleSettingChange("emailAlerts")} />
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
