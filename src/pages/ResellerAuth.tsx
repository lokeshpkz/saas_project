import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Key, Store, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { useResellerAuth } from "@/contexts/ResellerAuthContext"

const ResellerAuth = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useResellerAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password.")
      return
    }

    setIsLoading(true)

    try {
      const success = await login({ email, password })
      if (success) {
        toast.success("Welcome to your reseller portal!")
        navigate('/reseller/dashboard')
      } else {
        toast.error("Invalid email or password. Please check your credentials.")
      }
    } catch (error) {
      toast.error("Authentication failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div className="font-bold text-2xl text-foreground">
              Reseller<span className="text-primary">Portal</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to your reseller account to manage licenses
          </p>
        </div>

        {/* Auth Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Reseller Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your password was set when your reseller account was created
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back to Main */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => window.open('/', '_blank')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Open Main Portal
          </Button>
        </div>

        {/* Help Text */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-sm">Need Help?</h3>
              <p className="text-xs text-muted-foreground">
                Contact your platform administrator if you forgot your password or need assistance accessing your reseller account.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ResellerAuth