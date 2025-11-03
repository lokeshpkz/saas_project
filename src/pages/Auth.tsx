import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import React, { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"

export default function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, register, isAuthenticated, isLoading } = useAuth()

  // Tab state
  const [activeTab, setActiveTab] = useState("login")

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  })

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/dashboard"
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!loginData.email || !loginData.password) {
      return
    }

    const success = await login({
      email: loginData.email,
      password: loginData.password
    })

    if (success) {
      const from = location.state?.from?.pathname || "/dashboard"
      navigate(from, { replace: true })
    }
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!registerData.name || !registerData.email || !registerData.password) {
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      return
    }

    const success = await register({
      name: registerData.name,
      email: registerData.email,
      password: registerData.password
    })

    if (success) {
      const from = location.state?.from?.pathname || "/dashboard"
      navigate(from, { replace: true })
    } else {
      // If registration failed due to duplicate email, suggest switching to login
      // and pre-fill the email field
      setLoginData(prev => ({ ...prev, email: registerData.email }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </Button>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-4 w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-4 w-32 h-32 sm:w-40 sm:h-40 lg:w-56 lg:h-56 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md mx-auto bg-card/80 backdrop-blur-sm border-border/50 shadow-lg relative z-10">
        <CardHeader className="text-center pb-2 px-6 pt-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-white text-lg sm:text-xl font-bold">R</span>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Welcome to <span className="text-primary">Code</span>ryn
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Secure authentication and license management platform
            </p>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-8 pt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email Address</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="h-11"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="space-y-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email Address</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Create a password (min. 6 characters)"
                    value={registerData.password}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                    className="h-11"
                    minLength={6}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">Confirm Password</Label>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="h-11"
                    required
                  />
                  {registerData.password && registerData.confirmPassword &&
                    registerData.password !== registerData.confirmPassword && (
                      <p className="text-sm text-red-500">Passwords do not match</p>
                    )}
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 font-medium"
                  disabled={isLoading || registerData.password !== registerData.confirmPassword}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>

            {/* Footer */}
            <div className="text-center pt-6">
              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our{" "}
                <button className="underline hover:text-primary transition-colors">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button className="underline hover:text-primary transition-colors">
                  Privacy Policy
                </button>
              </p>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Mobile-friendly bottom text */}
      <div className="absolute bottom-4 left-4 right-4 text-center sm:bottom-8">
        <p className="text-xs text-muted-foreground/60">
          © 2025 Coderyn. All rights reserved.
        </p>
      </div>
    </div>
  )
}