import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Loader2, Eye, EyeOff, Copy, CheckCircle, Crown, AlertCircle } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useCreateReseller } from "@/hooks/useResellers"
import { apiClient } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"

interface AddResellerDialogProps {
  trigger?: React.ReactNode
}

export function AddResellerDialog({ trigger }: AddResellerDialogProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [appId, setAppId] = useState("")
  const [allowedLicenseKeys, setAllowedLicenseKeys] = useState("10")
  const [createdReseller, setCreatedReseller] = useState<any>(null)
  const [showCreatedPassword, setShowCreatedPassword] = useState(false)
  const { user } = useAuth()

  const createReseller = useCreateReseller()

  // Fetch user's apps
  const { data: appsData, isLoading: appsLoading } = useQuery({
    queryKey: ['apps'],
    queryFn: async () => {
      const response = await apiClient.getApps()
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch apps')
      }
      return response.data
    },
    enabled: open, // Only fetch when dialog is open
  })

  // Extract apps array from the response
  const apps = appsData?.apps || []

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let result = ''
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(result)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  const handleClose = () => {
    setOpen(false)
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setAppId("")
    setAllowedLicenseKeys("10")
    setCreatedReseller(null)
    setShowPassword(false)
    setShowCreatedPassword(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim() || !appId || !allowedLicenseKeys) {
      return
    }

    createReseller.mutate(
      {
        email: email.trim(),
        password: password.trim(),
        app_id: appId,
        allowed_license_keys: parseInt(allowedLicenseKeys)
      },
      {
        onSuccess: (data) => {
          // Store the created reseller data to show credentials
          setCreatedReseller(data)
        },
        onError: () => {
          // Reset form on error
          setEmail("")
          setPassword("")
          setAppId("")
          setAllowedLicenseKeys("10")
        }
      }
    )
  }

  // Check if user is on free plan
  const isFreeUser = user?.plan === 'free'

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) {
        resetForm()
      }
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-glow">
            <Plus className="w-4 h-4 mr-2" />
            Add Reseller
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
        {createdReseller ? (
          // Success state - show created reseller credentials
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Reseller Created Successfully
              </DialogTitle>
              <DialogDescription>
                The reseller account has been created. Please provide these credentials to the reseller.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Alert>
                <AlertDescription>
                  <strong>Important:</strong> Save these credentials now. The password will not be shown again.
                </AlertDescription>
              </Alert>

              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div className="grid gap-2">
                  <Label>Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Input value={createdReseller.email} readOnly className="bg-background" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(createdReseller.email)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Password</Label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showCreatedPassword ? "text" : "password"}
                        value={createdReseller.password}
                        readOnly
                        className="bg-background pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowCreatedPassword(!showCreatedPassword)}
                      >
                        {showCreatedPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(createdReseller.password)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Application</Label>
                  <Input value={createdReseller.app_id.name || 'Unknown App'} readOnly className="bg-background" />
                </div>

                <div className="grid gap-2">
                  <Label>License Limit</Label>
                  <Input value={createdReseller.allowed_license_keys} readOnly className="bg-background" />
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  The reseller can now log in to the reseller portal at <strong>/reseller/auth</strong> using these credentials.
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter>
              <Button onClick={() => setOpen(false)} className="w-full">
                Done
              </Button>
            </DialogFooter>
          </>
        ) : isFreeUser ? (
          // Free user restriction state
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                Reseller Creation Not Available
              </DialogTitle>
              <DialogDescription>
                Reseller creation is only available for premium subscribers.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Alert>
                <AlertDescription>
                  <strong>Free Plan Limitation:</strong> As a free user, you can only create resellers when you subscribe to our monthly or yearly premium plan.
                </AlertDescription>
              </Alert>

              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Upgrade to Premium</h3>
                    <p className="text-sm text-muted-foreground">
                      Unlock unlimited reseller creation and other premium features
                    </p>
                  </div>
                </div>

                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Unlimited reseller creation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Unlimited apps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Unlimited licenses per app</span>
                  </li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => window.location.href = '/subscription'} className="w-full">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
            </DialogFooter>
          </>
        ) : (
          // Form state - show creation form
          <>
            <DialogHeader>
              <DialogTitle>Add New Reseller</DialogTitle>
              <DialogDescription>
                Create a reseller account to allow partners to generate license keys for your apps.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter reseller email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generatePassword}
                    >
                      Generate
                    </Button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="app">Application *</Label>
                  {appsLoading ? (
                    <div className="flex items-center gap-2 p-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Loading apps...</span>
                    </div>
                  ) : (
                    <Select value={appId} onValueChange={setAppId} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select application" />
                      </SelectTrigger>
                      <SelectContent>
                        {apps && apps.length > 0 ? (
                          apps.map((app: any) => (
                            <SelectItem key={app._id} value={app._id}>
                              {app.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            No apps available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                  {apps && apps.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      You need to create an app first before adding resellers.
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="allowedLicenseKeys">License Key Limit *</Label>
                  <Input
                    id="allowedLicenseKeys"
                    type="number"
                    min="1"
                    max="10000"
                    placeholder="Number of licenses they can create"
                    value={allowedLicenseKeys}
                    onChange={(e) => setAllowedLicenseKeys(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum number of license keys this reseller can create
                  </p>
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createReseller.isPending || !apps || apps.length === 0}
                >
                  {createReseller.isPending ? "Creating..." : "Create Reseller"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}