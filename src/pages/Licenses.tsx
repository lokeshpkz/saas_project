import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Key, Clock, CheckCircle, XCircle, Trash2, MoreVertical, Edit, Loader2, Copy, AlertTriangle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { GenerateLicenseDialog } from "@/components/GenerateLicenseDialog"
import { EditLicenseDialog } from "@/components/EditLicenseDialog"
import { AddAppDialog } from "@/components/AddAppDialog"
import { NoAppEmptyState } from "@/components/EmptyState"
import { useLicenses, useDeleteLicense, useDeleteAllLicenses } from "@/hooks/useLicenses"
import { useDashboard } from "@/hooks/useDashboard"
import { useApps } from "@/hooks/useApps"
import { format } from "date-fns"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

const Licenses = () => {
  const { data: licensesData, isLoading, error } = useLicenses()
  const { data: dashboardData } = useDashboard()
  const { data: appsData, isLoading: appsLoading } = useApps()
  const deleteLicense = useDeleteLicense()
  const deleteAllLicenses = useDeleteAllLicenses()
  const [showAddAppDialog, setShowAddAppDialog] = useState(false)
  const navigate = useNavigate()

  // Extract actual arrays from API response objects
  const licenses = licensesData?.licenses || []
  const apps = appsData?.apps || []

  if (isLoading || appsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading licenses...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load licenses</p>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  // Show empty state if no apps exist
  if (!apps || apps.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Licenses</h1>
          <p className="text-lg text-muted-foreground">
            Monitor and manage all license keys and subscriptions.
          </p>
        </div>
        
        <NoAppEmptyState 
          onCreateApp={() => setShowAddAppDialog(true)}
          className="max-w-2xl mx-auto"
        />

        <AddAppDialog
          open={showAddAppDialog}
          onOpenChange={setShowAddAppDialog}
        />
      </div>
    )
  }

  const getStatusBadge = (license: any) => {
    const isExpired = new Date(license.expiresAt) < new Date()
    const isUsed = license.used

    if (isExpired) {
      return <Badge variant="destructive">
        <XCircle className="w-3 h-3 mr-1" />Expired
      </Badge>
    }

    if (isUsed) {
      return <Badge className="bg-success text-success-foreground">
        <CheckCircle className="w-3 h-3 mr-1" />Active
      </Badge>
    }

    return <Badge variant="secondary">
      <Clock className="w-3 h-3 mr-1" />Unused
    </Badge>
  }

  const handleDeleteLicense = (license: any) => {
    if (window.confirm(`Are you sure you want to delete license ${license.key}?`)) {
      deleteLicense.mutate(license._id)
    }
  }

  const handleDeleteAllLicenses = () => {
    if (licenses && licenses.length > 0) {
      if (window.confirm(`Are you sure you want to delete ALL ${licenses.length} licenses? This action cannot be undone.`)) {
        deleteAllLicenses.mutate()
      }
    } else {
      toast.info('No licenses to delete', {
        description: 'There are no licenses to delete.',
      });
    }
  }

  const handleCopyLicense = (licenseKey: string) => {
    navigator.clipboard.writeText(licenseKey)
    toast.success('License key copied to clipboard')
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy')
  }

  const getStats = () => {
    if (!licenses || !Array.isArray(licenses)) return { total: 0, active: 0, expired: 0, unused: 0 }
    
    const total = licenses.length
    const active = licenses.filter(l => l.used && new Date(l.expiresAt) > new Date()).length
    const expired = licenses.filter(l => new Date(l.expiresAt) < new Date()).length
    const unused = licenses.filter(l => !l.used && new Date(l.expiresAt) > new Date()).length

    return { total, active, expired, unused }
  }

  const stats = getStats()
  
  // Subscription information
  const isPremium = dashboardData?.user?.plan === 'premium'
  const licenseLimit = dashboardData?.user?.maxLicensesPerApp || 30

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Licenses</h1>
          <p className="text-lg text-muted-foreground">
            Monitor and manage all license keys and subscriptions.
          </p>
        </div>
        <div className="flex gap-2">
          {licenses && licenses.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleDeleteAllLicenses}
              disabled={deleteAllLicenses.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleteAllLicenses.isPending ? 'Deleting...' : 'Delete All'}
            </Button>
          )}
          {apps && apps.length > 0 && <GenerateLicenseDialog />}
        </div>
      </div>

      {/* Subscription Banner */}
      {!isPremium && (
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">Free Plan Limit</h3>
                  <p className="text-sm opacity-90">
                    Each app is limited to {licenseLimit} licenses. Upgrade for unlimited licenses.
                  </p>
                </div>
              </div>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => navigate('/subscription')}
                className="gap-2"
              >
                <AlertTriangle className="h-4 w-4" />
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Licenses
            </CardTitle>
            <Key className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.total.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">All licenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active
            </CardTitle>
            <CheckCircle className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.active.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unused
            </CardTitle>
            <Clock className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.unused.toLocaleString()}</div>
            <p className="text-sm text-warning">Available for use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expired
            </CardTitle>
            <XCircle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.expired.toLocaleString()}</div>
            <p className="text-sm text-destructive">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Licenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Licenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {licenses && licenses.length > 0 ? (
              licenses.map((license) => (
                <div key={license._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-smooth gap-3 sm:gap-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <Key className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground text-sm font-mono">
                          {license.key.substring(0, 16)}...
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleCopyLicense(license.key)}
                          title="Copy full license key"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        {getStatusBadge(license)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {typeof license.app === 'string' ? 'Unknown App' : license.app.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created: {formatDate(license.createdAt)}
                      </p>
                      {license.usedBy && (
                        <p className="text-xs text-muted-foreground">
                          Used by: {typeof license.usedBy === 'string' ? license.usedBy : (license.usedBy as any)?.username || 'Unknown User'}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="hidden lg:flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">Expires</p>
                      <p className="text-xs text-muted-foreground">{formatDate(license.expiresAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {license.used ? 'Used' : 'Unused'}
                      </p>
                      <p className="text-xs text-muted-foreground">Status</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleCopyLicense(license.key)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Full License Key
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <EditLicenseDialog 
                          license={license}
                          trigger={
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Expiry
                            </DropdownMenuItem>
                          }
                        />
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteLicense(license)}
                          className="text-destructive focus:text-destructive"
                          disabled={deleteLicense.isPending}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete License
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="lg:hidden flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{formatDate(license.expiresAt)}</p>
                      <p className="text-sm text-muted-foreground">
                        {license.used ? 'Used' : 'Unused'}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleCopyLicense(license.key)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Full Key
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <EditLicenseDialog 
                          license={license}
                          trigger={
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          }
                        />
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteLicense(license)}
                          className="text-destructive focus:text-destructive"
                          disabled={deleteLicense.isPending}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Key className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No licenses found</h3>
                <p className="text-muted-foreground mb-4">Create your first license to get started</p>
                {apps && apps.length > 0 && (
                  <GenerateLicenseDialog />
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Licenses