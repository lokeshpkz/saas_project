import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Key, 
  Activity,
  Shield,
  RefreshCw
} from "lucide-react"
import { toast } from "sonner"
import { useResellerAuth } from "@/contexts/ResellerAuthContext"
import { useResellerLicenses } from "@/hooks/useResellerLicenses"

const ResellerProfile = () => {
  const { reseller, fetchResellerProfile } = useResellerAuth()
  const { stats, fetchLicenses, loading } = useResellerLicenses()

  const handleRefresh = async () => {
    await Promise.all([
      fetchResellerProfile(),
      fetchLicenses()
    ])
    toast.success("Profile data refreshed successfully")
  }

  if (!reseller) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-lg text-muted-foreground">
            View your reseller account information and statistics.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={reseller.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Your registered email address. Contact your administrator if you need to change this.
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="app">Associated App</Label>
                <Input
                  id="app"
                  value={reseller.app_id?.name || 'Unknown App'}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  The application you're authorized to generate licenses for.
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="created">Account Created</Label>
                <Input
                  id="created"
                  value={new Date(reseller.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  When your reseller account was created.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Status & Stats */}
        <div className="space-y-6">
          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className="bg-success text-success-foreground">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm font-medium">
                  {new Date(reseller.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">App</span>
                <span className="text-sm font-medium">{reseller.app_id?.name || 'Unknown App'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Generated</span>
                <span className="text-sm font-medium">{stats.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Available</span>
                <span className="text-sm font-medium">{stats.active}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Used</span>
                <span className="text-sm font-medium">{stats.used}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Remaining</span>
                <span className="text-sm font-medium">{reseller.remaining_licenses}</span>
              </div>
            </CardContent>
          </Card>

          {/* License Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                License Usage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Used</span>
                  <span className="font-medium">{stats.total} / {reseller.allowed_license_keys}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${Math.min((stats.total / reseller.allowed_license_keys) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {reseller.remaining_licenses} licenses remaining
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-xs text-muted-foreground mb-1">Reseller ID</p>
                <p className="font-mono text-sm break-all">{reseller._id}</p>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Contact your administrator to increase your license limit.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>


    </div>
  )
}

export default ResellerProfile