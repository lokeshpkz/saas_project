import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useSettings } from "@/hooks/useSettings"
import {
  Bell,
  Globe,
  Lock,
  Settings as SettingsIcon,
  Pause,
  Shield,
  Loader2
} from "lucide-react"
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
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { apiClient } from "@/lib/api"

const Settings = () => {
  const { settings, loading, updating, updateSettings } = useSettings();
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const handleToggle = async (key: 'pauseApplications' | 'hwidLock', value: boolean) => {
    await updateSettings({ [key]: value });
  };

  const handleResetData = async () => {
    setIsResetting(true)
    try {
      // Call the actual API endpoint to reset all data
      await apiClient.resetPlatformData()
      
      toast.success("Platform data has been reset successfully")
      setShowResetDialog(false)
      
      // Log out the user after reset
      logout()
      navigate("/auth")
    } catch (error: any) {
      console.error("Failed to reset platform data:", error)
      toast.error(error.message || "Failed to reset platform data")
    } finally {
      setIsResetting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Settings</h1>
          <p className="text-lg text-muted-foreground">
            Configure your platform settings and preferences.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Theme</h3>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred color scheme
                </p>
              </div>
              <ThemeToggle />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Pause Applications</h3>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable all application access
                </p>
              </div>
              <Switch 
                checked={settings.pauseApplications}
                onCheckedChange={(checked) => handleToggle('pauseApplications', checked)}
                disabled={updating}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">HWID Lock</h3>
                <p className="text-sm text-muted-foreground">
                  Enable hardware ID verification for licenses
                </p>
              </div>
              <Switch 
                checked={settings.hwidLock}
                onCheckedChange={(checked) => handleToggle('hwidLock', checked)}
                disabled={updating}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings - Locked */}
        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-muted-foreground" />
                Notifications
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Coming Soon
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-muted-foreground">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Receive email alerts for important events
                </p>
              </div>
              <Switch disabled />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-muted-foreground">License Expiry Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  Get notified when licenses are about to expire
                </p>
              </div>
              <Switch disabled />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-muted-foreground">Failed Login Attempts</h3>
                <p className="text-sm text-muted-foreground">
                  Alert on suspicious login activity
                </p>
              </div>
              <Switch disabled />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-muted-foreground">Weekly Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Receive weekly platform usage reports
                </p>
              </div>
              <Switch disabled />
            </div>
          </CardContent>
        </Card>

        {/* Integration Settings - Locked */}
        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-muted-foreground" />
                Integrations
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Coming Soon
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-muted-foreground">Webhook Endpoints</h3>
                <p className="text-sm text-muted-foreground">
                  Configure webhook URLs for events
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>Configure</Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-muted-foreground">SMTP Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Email delivery configuration
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>Setup</Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-muted-foreground">Database Backup</h3>
                <p className="text-sm text-muted-foreground">
                  Automated backup configuration
                </p>
              </div>
              <Switch disabled />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-muted-foreground">API Integrations</h3>
                <p className="text-sm text-muted-foreground">
                  Third-party service connections
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>Manage</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
            <div>
              <h3 className="font-semibold text-foreground">Reset Platform Data</h3>
              <p className="text-sm text-muted-foreground">
                This will permanently delete all data and cannot be undone.
              </p>
            </div>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => setShowResetDialog(true)}
            >
              Reset Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reset Data Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all your platform data, 
              including users, licenses, resellers, and settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isResetting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetData}
              disabled={isResetting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isResetting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Data Permanently"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Settings