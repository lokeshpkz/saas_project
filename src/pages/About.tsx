import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Shield, 
  Users, 
  Key, 
  Store, 
  Zap, 
  Lock, 
  BarChart3, 
  Globe,
  CheckCircle,
  ArrowRight,
  Mail
} from "lucide-react"

const About = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure Authentication",
      description: "Enterprise-grade security with JWT tokens, password hashing, and hardware ID verification."
    },
    {
      icon: Key,
      title: "License Management",
      description: "Create, distribute, and manage license keys with expiration dates and usage tracking."
    },
    {
      icon: Store,
      title: "Reseller Network",
      description: "Build a partner ecosystem with controlled license distribution and quota management."
    },
    {
      icon: Users,
      title: "User Management",
      description: "Comprehensive user tracking with ban controls, activity monitoring, and account management."
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Real-time insights into license usage, user activity, and platform performance."
    },
    {
      icon: Lock,
      title: "Application Control",
      description: "Pause/resume applications globally and manage access with granular controls."
    }
  ]

  const stats = [
    { label: "Secure", value: "100%", description: "Enterprise Security" },
    { label: "Uptime", value: "99.9%", description: "Reliable Service" },
    { label: "Support", value: "24/7", description: "Always Available" },
    { label: "Response", value: "<1s", description: "Lightning Fast" }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
            <span className="text-white text-2xl font-bold">R</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground">
          About <span className="text-primary">Code</span>ryn
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          The next-generation authentication and license management platform designed for modern applications. 
          Secure, scalable, and built for developers who demand excellence.
        </p>
      </div>

      {/* Mission Statement */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              To empower developers and businesses with a comprehensive, secure, and user-friendly platform 
              for managing authentication, licensing, and user access control. We believe in making complex 
              security simple and accessible to everyone.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="font-semibold text-foreground">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.description}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Platform Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage authentication, licensing, and user access in one powerful platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="transition-smooth hover:shadow-md">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Built with Modern Technology
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-3">Frontend</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">Tailwind CSS</Badge>
                <Badge variant="secondary">Vite</Badge>
                <Badge variant="secondary">React Query</Badge>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Backend</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Node.js</Badge>
                <Badge variant="secondary">Express</Badge>
                <Badge variant="secondary">MongoDB</Badge>
                <Badge variant="secondary">JWT</Badge>
                <Badge variant="secondary">bcrypt</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security & Compliance */}
      <Card className="border-success/20 bg-success/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-success" />
            Security & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm">End-to-end encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm">Hardware ID verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm">Secure password hashing</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm">JWT token authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm">Role-based access control</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm">Activity monitoring & logging</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-primary/10">
                <Mail className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground">Get in Touch</h3>
            <p className="text-muted-foreground">
              Have questions about Coderyn? We're here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="gap-2">
                <Mail className="w-4 h-4" />
                Contact Support
              </Button>
              <Button variant="outline" className="gap-2">
                <Globe className="w-4 h-4" />
                Documentation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default About