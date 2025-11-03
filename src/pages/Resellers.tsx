import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Store, TrendingUp, Trash2, ExternalLink, Loader2, Edit, Key, Crown, AlertCircle, CheckCircle } from "lucide-react"
import { AddResellerDialog } from "@/components/AddResellerDialog"
import { EditResellerDialog } from "@/components/EditResellerDialog"
import { AddAppDialog } from "@/components/AddAppDialog"
import { NoAppEmptyState } from "@/components/EmptyState"
import { useResellers, useDeleteReseller } from "@/hooks/useResellers"
import { useApps } from "@/hooks/useApps"
import { format } from "date-fns"
import { toast } from "sonner"
import { DeleteResellerConfirmDialog } from "@/components/DeleteResellerConfirmDialog"
import { useAuth } from "@/contexts/AuthContext"
import { Alert, AlertDescription } from "@/components/ui/alert"

const Resellers = () => {
  const { data: resellersData, isLoading, error } = useResellers()
  const { data: appsData, isLoading: appsLoading } = useApps()
  const { user } = useAuth()
  const deleteReseller = useDeleteReseller()
  const [showAddAppDialog, setShowAddAppDialog] = useState(false)
  const [deletingReseller, setDeletingReseller] = useState<any | null>(null)

  // Extract arrays from the response
  const apps = appsData?.apps || []
  const resellers = resellersData?.resellers || []

  // Check if user is on free plan
  const isFreeUser = user?.plan === 'free'

  if (isLoading || appsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading resellers...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load resellers</p>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  // Show empty state if no apps exist
  if (!apps || apps.length === 0) {
    return (
      <div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Resellers</h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mt-1">
            Manage your reseller network and license distribution partners.
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

  const handleDeleteReseller = (reseller: any) => {
    if (!reseller || !reseller._id || !reseller.email) {
      toast.error('Invalid reseller data')
      return
    }
    
    setDeletingReseller(reseller)
  }

  const confirmDeleteReseller = () => {
    if (deletingReseller) {
      deleteReseller.mutate(deletingReseller._id, {
        onSettled: () => {
          setDeletingReseller(null)
        }
      })
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy')
  }

  const getStats = () => {
    if (!resellers || !Array.isArray(resellers)) return { total: 0, totalLicenses: 0, avgLicenses: 0 }

    const validResellers = resellers.filter((r: any) => r && typeof r.usedLicenses === 'number')
    const total = validResellers.length
    const totalLicenses = validResellers.reduce((sum: number, r: any) => sum + (r.usedLicenses || 0), 0)
    const avgLicenses = total > 0 ? Math.round(totalLicenses / total) : 0

    return { total, totalLicenses, avgLicenses }
  }

  const stats = getStats()

  const getUsageColor = (used: number, allowed: number) => {
    const percentage = allowed > 0 ? (used / allowed) * 100 : 0
    if (percentage >= 90) return "text-destructive"
    if (percentage >= 70) return "text-warning"
    return "text-success"
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 px-4 sm:px-0">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Resellers</h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mt-1">
                Manage your reseller network and license distribution partners.
              </p>
            </div>
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 sm:flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => window.open('/reseller/auth', '_blank')}
                className="flex items-center justify-center gap-2 text-xs sm:text-sm"
                size="sm"
              >
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Reseller Portal</span>
                <span className="xs:hidden">Portal</span>
              </Button>
              {apps && apps.length > 0 && <AddResellerDialog />}
            </div>
          </div>
          
          {/* Stats Summary for Mobile */}
          {resellers && resellers.length > 0 && (
            <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                <span className="whitespace-nowrap">{stats.total} Total</span>
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-success flex-shrink-0"></div>
                <span className="whitespace-nowrap">{stats.totalLicenses} Licenses</span>
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-warning flex-shrink-0"></div>
                <span className="whitespace-nowrap">{stats.avgLicenses} Avg</span>
              </span>
            </div>
          )}
        </div>

        {/* Reseller Info */}
        <Card className="border-primary/20 bg-primary/5 mx-4 sm:mx-0">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Store className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">About Resellers</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                    <p className="font-medium text-foreground text-xs sm:text-sm">What Resellers Do:</p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                      <li>Create and distribute license keys for your apps</li>
                      <li>Have their own portal to manage licenses</li>
                      <li>Limited by the license quota you set</li>
                      <li className="hidden sm:list-item">Can only create licenses for assigned apps</li>
                    </ul>
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                    <p className="font-medium text-foreground text-xs sm:text-sm">Management Options:</p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                      <li>Set license creation limits per reseller</li>
                      <li>Monitor license usage and remaining quota</li>
                      <li>Update license limits as needed</li>
                      <li className="hidden sm:list-item">Remove resellers when necessary</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Free User Alert */}
        {isFreeUser && (
          <Alert className="mx-4 sm:mx-0 border-warning/50 bg-warning/5">
            <AlertCircle className="h-4 w-4 text-warning" />
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="flex-1">
                <strong>Free Plan Limitation:</strong> You can only create resellers when you subscribe to our monthly or yearly premium plan.
              </span>
              <Button 
                size="sm" 
                onClick={() => window.location.href = '/subscription'}
                className="whitespace-nowrap"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 px-4 sm:px-0">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
              Total Resellers
            </CardTitle>
            <Store className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{stats.total.toLocaleString()}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Active partners</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
              Licenses Created
            </CardTitle>
            <Key className="w-3 h-3 sm:w-4 sm:h-4 text-success flex-shrink-0" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{stats.totalLicenses.toLocaleString()}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">By all resellers</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
              Average per Reseller
            </CardTitle>
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-warning flex-shrink-0" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{stats.avgLicenses.toLocaleString()}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Licenses created</p>
          </CardContent>
        </Card>
      </div>

      {/* Resellers Table */}
      <Card className="mx-4 sm:mx-0">
        <CardHeader className="px-3 sm:px-6">
          <CardTitle className="text-base sm:text-lg">Reseller Directory ({resellers?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="space-y-3 sm:space-y-4">
            {resellers && resellers.length > 0 ? (
              resellers.filter((reseller: any) => reseller && (reseller.email || reseller.user?.email)).map((reseller: any) => (
                <div key={reseller._id} className="flex flex-col p-3 sm:p-4 rounded-lg border bg-card hover:bg-muted/50 transition-smooth gap-3">
                  {/* Mobile Layout */}
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Store className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 mb-1">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{(reseller as any).email || (reseller as any).user?.email || 'Unknown Email'}</h3>
                        <Badge className="bg-success text-success-foreground text-xs w-fit">Active</Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          App: {(reseller as any).app?.name || (reseller as any).app_id?.name || 'Unknown App'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Joined {reseller.createdAt ? formatDate(reseller.createdAt) : 'Unknown'}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Usage:
                          </span>
                          <span className={`text-xs font-medium ${getUsageColor((reseller as any).usedLicenses || (reseller as any).created_licenses || 0, (reseller as any).licenseLimit || (reseller as any).allowed_license_keys || 0)}`}>
                            {(reseller as any).usedLicenses || (reseller as any).created_licenses || 0} / {(reseller as any).licenseLimit || (reseller as any).allowed_license_keys || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                    <EditResellerDialog
                      reseller={reseller}
                      trigger={
                        <Button variant="outline" size="sm" className="flex-1 xs:flex-none">
                          <Edit className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm">Edit</span>
                        </Button>
                      }
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteReseller(reseller)}
                      disabled={deleteReseller.isPending}
                      className="text-destructive hover:text-destructive flex-1 xs:flex-none"
                    >
                      <Trash2 className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">Delete</span>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Store className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">No Resellers Yet</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 max-w-md mx-auto px-4">
                  Create reseller accounts to allow partners to generate and distribute license keys for your applications.
                </p>
                <div className="flex flex-col xs:flex-row gap-2 justify-center px-4">
                  {apps && apps.length > 0 ? (
                    isFreeUser ? (
                      <Button 
                        className="text-xs sm:text-sm" 
                        onClick={() => window.location.href = '/subscription'}
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade to Create Resellers
                      </Button>
                    ) : (
                      <AddResellerDialog
                        trigger={
                          <Button className="text-xs sm:text-sm">
                            Create First Reseller
                          </Button>
                        }
                      />
                    )
                  ) : (
                    <Button 
                      className="text-xs sm:text-sm" 
                      onClick={() => setShowAddAppDialog(true)}
                    >
                      Create App First
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => window.open('/reseller/auth', '_blank')}
                    className="text-xs sm:text-sm"
                  >
                    View Reseller Portal
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Reseller Confirmation Dialog */}
      <DeleteResellerConfirmDialog
        reseller={deletingReseller}
        open={!!deletingReseller}
        onOpenChange={(open) => !open && setDeletingReseller(null)}
        onConfirm={confirmDeleteReseller}
        isDeleting={deleteReseller.isPending}
      />
    </div>
  )
}

export default Resellers