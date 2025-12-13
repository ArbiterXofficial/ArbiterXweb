import { useState } from "react";
import { Twitter, MessageCircle, Send, Github, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive updates about ArbiterX.",
      });
      setEmail("");
    }
  };

  const links = {
    product: [
      { name: "Features", href: "#features" },
      { name: "How It Works", href: "#how-it-works" },
      { name: "Roadmap", href: "#roadmap" },
      { name: "Documentation", href: "#" },
    ],
    developers: [
      { name: "API Reference", href: "#" },
      { name: "SDK", href: "#" },
      { name: "GitHub", href: "#" },
      { name: "Testnet", href: "#" },
    ],
    company: [
      { name: "About", href: "#about" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
    ],
  };

  const socials = [
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Discord", icon: MessageCircle, href: "#" },
    { name: "Telegram", icon: Send, href: "#" },
    { name: "GitHub", icon: Github, href: "#" },
  ];

  return (
    <footer className="relative border-t border-border/50 bg-card/30">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        {/* Top Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Brand & Newsletter */}
          <div>
            <a href="#" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-bold text-lg">A</span>
              </div>
              <span className="font-heading font-bold text-xl">
                Arbiter<span className="gradient-text">X</span>
              </span>
            </a>
            
            <p className="text-muted-foreground max-w-md mb-6">
              The next-generation cross-chain wallet and instant swap platform. 
              Move assets across blockchains seamlessly with minimal fees.
            </p>

            {/* Newsletter */}
            <div className="max-w-md">
              <h4 className="font-heading font-semibold mb-3">Stay Updated</h4>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    required
                  />
                </div>
                <Button type="submit" variant="hero">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-heading font-semibold mb-4 text-foreground">Product</h4>
              <ul className="space-y-3">
                {links.product.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4 text-foreground">Developers</h4>
              <ul className="space-y-3">
                {links.developers.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4 text-foreground">Company</h4>
              <ul className="space-y-3">
                {links.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4 text-foreground">Legal</h4>
              <ul className="space-y-3">
                {links.legal.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ArbiterX. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="w-10 h-10 rounded-lg bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
                aria-label={social.name}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
