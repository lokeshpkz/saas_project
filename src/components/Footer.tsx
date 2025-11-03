import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Key,
  Heart,
  Info,
  FileText,
  Shield,
  Mail,
  MessageCircle,
  Youtube,
  Truck,
  RotateCcw,
  CreditCard
} from "lucide-react"

export function Footer() {
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: "About",
      url: "/about",
      icon: Info
    },
    {
      title: "Terms",
      url: "/terms",
      icon: FileText
    },
    {
      title: "Privacy",
      url: "/privacy",
      icon: Shield
    }
  ]

  const policyLinks = [
    {
      title: "Shipping Policy",
      url: "https://merchant.razorpay.com/policy/RJKSTuorZtCDDN/shipping",
      icon: Truck
    },
    {
      title: "Refund Policy",
      url: "https://merchant.razorpay.com/policy/RJKSTuorZtCDDN/refund",
      icon: RotateCcw
    },
    {
      title: "Payment Terms",
      url: "https://merchant.razorpay.com/policy/RJKSTuorZtCDDN/terms",
      icon: CreditCard
    }
  ]

  const socialLinks = [
    {
      title: "Discord",
      url: "https://discord.gg/hag6TZ7urH",
      icon: MessageCircle
    },
    {
      title: "YouTube",
      url: "https://www.youtube.com/@Coderyn",
      icon: Youtube
    }
  ]

  return (
    <footer className="border-t bg-card/60 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <Key className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="font-bold text-lg text-foreground">
                Code<span className="text-primary">ryn</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Secure authentication platform
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {footerLinks.map((link) => (
              <Button
                key={link.title}
                variant="ghost"
                size="sm"
                onClick={() => navigate(link.url)}
                className="gap-2 text-muted-foreground hover:text-foreground h-auto p-2"
              >
                <link.icon className="w-4 h-4" />
                <span className="text-sm">{link.title}</span>
              </Button>
            ))}

            <Separator orientation="vertical" className="h-6 hidden sm:block" />

            {policyLinks.map((link) => (
              <Button
                key={link.title}
                variant="ghost"
                size="sm"
                onClick={() => window.open(link.url, '_blank')}
                className="gap-2 text-muted-foreground hover:text-foreground h-auto p-2"
                title={link.title}
              >
                <link.icon className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">{link.title}</span>
              </Button>
            ))}

            <Separator orientation="vertical" className="h-6 hidden sm:block" />

            {socialLinks.map((link) => (
              <Button
                key={link.title}
                variant="ghost"
                size="sm"
                onClick={() => window.open(link.url, '_blank')}
                className="gap-2 text-muted-foreground hover:text-foreground h-auto p-2"
                title={link.title}
              >
                <link.icon className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">{link.title}</span>
              </Button>
            ))}
          </div>
        </div>

        <Separator className="my-3 sm:my-4" />

        {/* Copyright and Additional Info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>© {currentYear} Coderyn. Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>for developers.</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span>Version 1.0.0</span>
            <span>•</span>
            <span>All rights reserved</span>
            <span>•</span>
            <span>Enterprise-grade security</span>
          </div>
        </div>
      </div>
    </footer>
  )
}