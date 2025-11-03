import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { 
  ArrowRight, 
  Shield, 
  Key, 
  Users, 
  Store, 
  Zap, 
  CheckCircle, 
  Star,
  Globe,
  Lock,
  BarChart3,
  Sparkles,
  Play,
  ChevronDown,
  Github,
  Twitter,
  Mail,
  ArrowUpRight,
  Rocket,
  Target,
  Award,
  TrendingUp,
  LogIn,
  LayoutDashboard,
  Sun,
  Moon
} from "lucide-react"
import { useNavigate } from "react-router-dom"

type Theme = "light" | "dark" | "system"

const Landing = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, isLoading } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [theme, setTheme] = useState<Theme>("system")

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, isLoading, navigate])

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      setTheme("system")
    }
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement
    
    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.remove("light", "dark")
      root.classList.add(systemTheme)
    } else {
      root.classList.remove("light", "dark")
      root.classList.add(newTheme)
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    applyTheme(newTheme)
  }

  const getCurrentTheme = () => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    return theme
  }

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Military-grade encryption, JWT authentication, and hardware ID verification",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Key,
      title: "License Management",
      description: "Generate, distribute, and track license keys with advanced analytics",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      icon: Store,
      title: "Reseller Network",
      description: "Build and manage partner ecosystems with automated distribution",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Users,
      title: "User Management",
      description: "Comprehensive user tracking with advanced access controls",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Powerful insights and reporting with customizable dashboards",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Sub-second response times with global CDN and edge computing",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    }
  ]

  const stats = [
    { value: "99.99%", label: "Uptime SLA", icon: Target },
    { value: "<100ms", label: "Response Time", icon: Zap },
    { value: "256-bit", label: "Encryption", icon: Shield },
    { value: "24/7", label: "Support", icon: Users }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO at TechFlow",
      avatar: "SC",
      content: "Coderyn transformed our license management. The security features and ease of use are unmatched.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Lead Developer at InnovateLabs",
      avatar: "MR", 
      content: "Implementation was seamless. The reseller network feature helped us scale our distribution effortlessly.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Product Manager at SecureApps",
      avatar: "EW",
      content: "The analytics dashboard provides incredible insights. We've optimized our licensing strategy completely.",
      rating: 5
    }
  ]

  const benefits = [
    {
      icon: Rocket,
      title: "Quick Setup",
      description: "Get started in minutes with our simple setup process and comprehensive documentation."
    },
    {
      icon: Globe,
      title: "Global Scale",
      description: "Built to handle millions of users worldwide with enterprise-grade infrastructure."
    },
    {
      icon: Lock,
      title: "Bank-Level Security",
      description: "Military-grade encryption and security protocols protect your data and users."
    },
    {
      icon: TrendingUp,
      title: "Analytics Insights",
      description: "Powerful analytics and reporting to understand your users and optimize performance."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Built for teams with role-based access controls and collaborative features."
    },
    {
      icon: Award,
      title: "Industry Leading",
      description: "Trusted by industry leaders and backed by proven security certifications."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-white text-sm sm:text-base font-bold">C</span>
              </div>
              <span className="font-bold text-xl sm:text-2xl text-foreground">
                Code<span className="text-primary">ryn</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              ) : (
                <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Get Started
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-9 h-9 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {getCurrentTheme() === 'dark' ? (
                  <Sun className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                )}
              </Button>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-9 h-9 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {getCurrentTheme() === 'dark' ? (
                  <Sun className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                )}
              </Button>
              <Button variant="ghost" size="sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16 lg:mb-20">
            <Badge variant="secondary" className="mb-4 sm:mb-6 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Trusted by 1000+ Developers
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
              Modern Authentication & <span className="bg-gradient-primary bg-clip-text text-transparent">License Management</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-3xl mx-auto">
              Secure, scalable, and easy-to-integrate authentication platform with advanced license management for your software products.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              {isAuthenticated ? (
                <Button 
                  onClick={() => navigate('/dashboard')}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 gap-2 sm:gap-3"
                >
                  <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6" />
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => navigate('/auth')}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 gap-2 sm:gap-3"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 gap-2 sm:gap-3 border-2"
                  >
                    <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                    Watch Demo
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Hero Image/Animation */}
          <div className="relative max-w-5xl mx-auto">
            <div className="relative rounded-2xl bg-gradient-to-br from-card to-muted border shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
              <div className="relative p-6 sm:p-8 lg:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-blue-500" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground">Secure Authentication</h3>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      JWT-based authentication with military-grade encryption and hardware ID binding for maximum security.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-muted-foreground">Multi-factor authentication</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-muted-foreground">Session management</span>
                    </div>
                  </div>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <Key className="w-5 h-5 text-green-500" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground">License Management</h3>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Generate, distribute, and track license keys with advanced analytics and reseller network support.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-muted-foreground">Unlimited license keys</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-muted-foreground">Reseller integration</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2 sm:mb-3">
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm sm:text-base text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Everything You Need to <span className="bg-gradient-primary bg-clip-text text-transparent">Secure & Scale</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive platform features designed to protect your software and grow your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`transition-all duration-500 hover:shadow-xl hover:-translate-y-2 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm ${
                  activeFeature === index ? 'ring-2 ring-blue-500 shadow-xl' : ''
                }`}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Why Choose <span className="bg-gradient-primary bg-clip-text text-transparent">Coderyn</span>?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Built by developers, for developers. Experience the difference with our enterprise-grade platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Trusted by <span className="bg-gradient-primary bg-clip-text text-transparent">Developers Worldwide</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied developers who have transformed their authentication and licensing workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Ready to <span className="bg-gradient-primary bg-clip-text text-transparent">Get Started</span>?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto">
              Join thousands of developers who trust Coderyn for their authentication and license management needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              {isAuthenticated ? (
                <Button 
                  onClick={() => navigate('/dashboard')}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 gap-3"
                >
                  <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6" />
                  Go to Dashboard
                </Button>
              ) : (
                <Button 
                  onClick={() => navigate('/auth')}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 gap-3"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
              )}
              <Button 
                variant="outline" 
                size="lg"
                className="text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 gap-3 border-2"
              >
                Schedule a Demo
                <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">C</span>
                </div>
                <span className="font-bold text-lg text-foreground">
                  Code<span className="text-primary">ryn</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Modern authentication and license management platform for developers.
              </p>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Github className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">API Reference</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="https://merchant.razorpay.com/policy/RJKSTuorZtCDDN/shipping" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Shipping Policy</a></li>
                <li><a href="https://merchant.razorpay.com/policy/RJKSTuorZtCDDN/refund" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Refund Policy</a></li>
                <li><a href="https://merchant.razorpay.com/policy/RJKSTuorZtCDDN/terms" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Payment Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 sm:mt-12 pt-8 sm:pt-12 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Coderyn. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing