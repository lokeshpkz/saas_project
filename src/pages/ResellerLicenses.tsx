import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Key, Clock, CheckCircle, XCircle, UserCheck, MoreVertical, Copy, RefreshCw, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { GenerateResellerLicenseDialog } from "@/components/GenerateResellerLicenseDialog"
import { toast } from "sonner"
import { useResellerLicenses } from "@/hooks/useResellerLicenses"
import { useResellerAuth } from "@/contexts/ResellerAuthContext"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

const ResellerLicenses = () => {
  const { licenses, stats, loading, fetchLicenses, deleteAllLicenses } = useResellerLicenses()
  const { reseller, fetchResellerProfile } = useResellerAuth()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const getStatusBadge = (license: any) => {
    const isExpired = new Date(license.date_expired) <= new Date()
    const isUsed = license.used

    if (isUsed) {
      return <Badge className="bg-success text-success-foreground">
        <CheckCircle className="w-3 h-3 mr-1" />Used
      </Badge>
    }

    if (isExpired) {
      return <Badge variant="destructive">
        <XCircle className="w-3 h-3 mr-1" />Expired
      </Badge>
    }

    return <Badge variant="secondary">
      <Clock className="w-3 h-3 mr-1" />Available
    </Badge>
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("License key copied to clipboard")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleRefresh = async () => {
    await Promise.all([
      fetchLicenses(),
      fetchResellerProfile()
    ])
    toast.success("Data refreshed successfully")
  }

  const handleDeleteAll = async () => {
    setDeleting(true)
    try {
      const success = await deleteAllLicenses()
      if (success) {
        await Promise.all([
          fetchLicenses(),
          fetchResellerProfile()
        ])
        setShowDeleteConfirm(false)
      }
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground">License Management</h1>
          <p className="text-lg text-muted-foreground">
            Generate and manage license keys for your clients.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {licenses.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleting}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete All
            </Button>
          )}
          <GenerateResellerLicenseDialog />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Generated
            </CardTitle>
            <Key className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.total}</div>
            <p className="text-sm text-muted-foreground">{reseller?.remaining_licenses || 0} remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available
            </CardTitle>
            <CheckCircle className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.active}</div>
            <p className="text-sm text-muted-foreground">{Math.round((stats.active / stats.total) * 100) || 0}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Used
            </CardTitle>
            <UserCheck className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.used}</div>
            <p className="text-sm text-primary">{Math.round((stats.used / stats.total) * 100) || 0}% usage rate</p>
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
            <div className="text-3xl font-bold text-foreground">{stats.expired}</div>
            <p className="text-sm text-destructive">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Licenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Generated Licenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {licenses.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Key className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No licenses generated yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by generating your first license keys for your clients
                </p>
                <GenerateResellerLicenseDialog />
              </div>
            ) : (
              licenses.map((license) => (
                <div key={license._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-smooth gap-3 sm:gap-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <Key className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground font-mono text-sm">
                          {license.key ? license.key.substring(0, 16) + '...' : 'Unknown License'}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(license.key || '')}
                          title="Copy full license key"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        {getStatusBadge(license)}
                      </div>
                      <p className="text-sm text-muted-foreground">{reseller?.app_id.name}</p>
                      <p className="text-xs text-muted-foreground">Created: {formatDate(license.createdAt)}</p>
                    </div>
                  </div>

                  <div className="hidden lg:flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">Expires</p>
                      <p className="text-xs text-muted-foreground">{formatDate(license.expiresAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {license.used ? 'Used' : 'Available'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {license.usedBy || 'Not used'}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => copyToClipboard(license.key || '')}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy License Key
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="lg:hidden flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{formatDate(license.expiresAt)}</p>
                      <p className="text-sm text-muted-foreground">
                        {license.used ? 'Used' : 'Available'}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => copyToClipboard(license.key || '')}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Key
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete All Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all {licenses.length} license(s) you have generated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAll} 
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete All'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ResellerLicenses