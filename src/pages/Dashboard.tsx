import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Key, Store, Crown, Loader2, Plus, Edit, Trash2, Play, Pause, Copy, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApps, useDeleteApp, useToggleAppPause } from "@/hooks/useApps";
import { useAuth } from "@/contexts/AuthContext";
import { AddAppDialog } from "@/components/AddAppDialog";
import { EditAppDialog } from "@/components/EditAppDialog";
import { DeleteAppConfirmDialog } from "@/components/DeleteAppConfirmDialog";
import { AppSettingsDialog } from "@/components/AppSettingsDialog";
import { App as AppType } from "@/lib/api";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { data: appsData, isLoading: appsLoading } = useApps();
  const deleteApp = useDeleteApp();
  const toggleAppPause = useToggleAppPause();
  const [showAddAppDialog, setShowAddAppDialog] = useState(false);
  const [editingApp, setEditingApp] = useState<AppType | null>(null);
  const [deletingApp, setDeletingApp] = useState<AppType | null>(null);
  const [settingsApp, setSettingsApp] = useState<AppType | null>(null);

  // Extract apps array from the data structure
  const apps = appsData?.apps || [];

  // Show loading while auth is loading or apps are loading
  const isLoading = authLoading || appsLoading;

  const handleDeleteApp = (app: AppType) => {
    setDeletingApp(app);
  };

  const confirmDeleteApp = () => {
    if (deletingApp) {
      deleteApp.mutate(deletingApp._id, {
        onSettled: () => {
          setDeletingApp(null);
        }
      });
    }
  };

  const handleToggleAppPause = async (appId: string) => {
    toggleAppPause.mutate(appId);
  };

  const handleCopyAppId = (appId: string) => {
    navigator.clipboard.writeText(appId);
    toast.success('App ID copied to clipboard');
  };

  const handleCopyAppDetails = (app: AppType) => {
    const appDetails = `App ID: ${app.appId}\nApp Secret: ${app.appSecret}\nVersion: ${app.version}`;
    navigator.clipboard.writeText(appDetails);
    toast.success('App details copied to clipboard', {
      description: 'App ID, Secret, and Version copied'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatLimit = (limit: number | null | undefined) => {
    if (limit === null || limit === undefined || limit === -1) {
      return '∞';
    }
    return limit.toString();
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const isPremium = user.plan === 'premium';
  const appLimit = user.maxApps;
  const appCount = apps.length;
  const canCreateMoreApps = appLimit === -1 || appCount < (appLimit || 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">Dashboard</h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground mt-1">
            Welcome back, {user.name}! Here's what's happening with your platform.
          </p>
        </div>
      </div>

      {/* Subscription Banner */}
      {!isPremium && (
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Crown className="h-8 w-8" />
                <div>
                  <h3 className="font-semibold text-lg">Upgrade to Premium</h3>
                  <p className="text-sm opacity-90">
                    Unlock unlimited apps and licenses. Currently using {appCount} of {formatLimit(appLimit)} apps.
                  </p>
                </div>
              </div>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => navigate('/subscription')}
                className="gap-2"
              >
                <Crown className="h-4 w-4" />
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <Card className="transition-smooth hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 px-3 sm:px-4 md:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
              Total Apps
            </CardTitle>
            <div className="p-1 sm:p-2 rounded-lg bg-muted text-primary flex-shrink-0">
              <Package className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">{apps.length}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs sm:text-sm text-muted-foreground">of {formatLimit(appLimit)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="transition-smooth hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 px-3 sm:px-4 md:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
              Plan
            </CardTitle>
            <div className="p-1 sm:p-2 rounded-lg bg-muted text-warning flex-shrink-0">
              <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">{isPremium ? 'Premium' : 'Free'}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs sm:text-sm text-muted-foreground">{isPremium ? 'Unlimited' : 'Limited'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Apps Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Applications</CardTitle>
            <p className="text-sm text-muted-foreground">
              {apps.length}/{formatLimit(appLimit)}
            </p>
          </div>
          <Button
            onClick={() => setShowAddAppDialog(true)}
            disabled={!canCreateMoreApps}
            size="sm"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add App
          </Button>
        </CardHeader>
        <CardContent>
          {apps && apps.length > 0 ? (
            <div className="space-y-3">
              {apps.map((app) => (
                <div key={app._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm sm:text-base truncate">{app.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        v{app.version}
                      </Badge>
                      {app.paused && (
                        <Badge variant="destructive" className="text-xs">
                          Paused
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="truncate">ID: {app.appId}</span>
                      <span>{formatDate(app.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleAppPause(app._id)}
                      className="h-8 w-8 p-0"
                    >
                      {app.paused ? (
                        <Play className="w-4 h-4" />
                      ) : (
                        <Pause className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyAppDetails(app)}
                      className="h-8 w-8 p-0"
                      title="Copy app details (ID, Secret, Version)"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSettingsApp(app)}
                      className="h-8 w-8 p-0"
                      title="App settings"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingApp(app)}
                      className="h-8 w-8 p-0"
                      title="Edit app"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteApp(app)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      title="Delete app"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No applications yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first application to get started with license management.
              </p>
              <Button
                onClick={() => setShowAddAppDialog(true)}
                disabled={!canCreateMoreApps}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Your First App
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddAppDialog
        open={showAddAppDialog}
        onOpenChange={setShowAddAppDialog}
      />
      
      {editingApp && (
        <EditAppDialog
          app={editingApp}
          open={!!editingApp}
          onOpenChange={(open) => !open && setEditingApp(null)}
        />
      )}
      
      {deletingApp && (
        <DeleteAppConfirmDialog
          app={deletingApp}
          open={!!deletingApp}
          onOpenChange={(open) => !open && setDeletingApp(null)}
          onConfirm={confirmDeleteApp}
        />
      )}
      
      {settingsApp && (
        <AppSettingsDialog
          app={settingsApp}
          open={!!settingsApp}
          onOpenChange={(open) => !open && setSettingsApp(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;