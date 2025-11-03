import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users as UsersIcon, UserCheck, UserX, Clock, Ban, Trash2, MoreVertical, Loader2, UserPlus, RefreshCw } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useEndUsers, useBanEndUser, useDeleteEndUser, useCreateEndUser, useResetClientHwid } from "@/hooks/useUsers"
import { useDashboard } from "@/hooks/useDashboard"
import { useApps } from "@/hooks/useApps"
import { AddAppDialog } from "@/components/AddAppDialog"
import { CreateEndUserDialog } from "@/components/CreateEndUserDialog"
import { NoAppEmptyState } from "@/components/EmptyState"
import { format } from "date-fns"

const Users = () => {
  const { data: users, isLoading, error } = useEndUsers()
  const { data: dashboardData } = useDashboard()
  const { data: appsData, isLoading: appsLoading } = useApps()
  const banEndUser = useBanEndUser()
  const deleteEndUser = useDeleteEndUser()
  const createEndUser = useCreateEndUser()
  const resetClientHwid = useResetClientHwid()
  const [showAddAppDialog, setShowAddAppDialog] = useState(false)
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false)

  // Extract apps array from the response
  const apps = appsData?.apps || []

  if (isLoading || appsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading users...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load users</p>
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
          <h1 className="text-4xl font-bold text-foreground">End Users</h1>
          <p className="text-lg text-muted-foreground">
            Manage end users who have registered using your license keys.
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

  const getStatusBadge = (user: any) => {
    const isExpired = new Date(user.expiresAt) < new Date()
    const isBanned = user.ban

    if (isBanned) {
      return <Badge variant="destructive">
        <Ban className="w-3 h-3 mr-1" />Banned
      </Badge>
    }

    if (isExpired) {
      return <Badge variant="secondary">
        <Clock className="w-3 h-3 mr-1" />Expired
      </Badge>
    }

    return <Badge className="bg-success text-success-foreground">
      <UserCheck className="w-3 h-3 mr-1" />Active
    </Badge>
  }

  const handleBanUser = (user: any) => {
    if (window.confirm(`Are you sure you want to ban ${user.username}?`)) {
      banEndUser.mutate({ userId: user._id, is_banned: true })
    }
  }

  const handleUnbanUser = (user: any) => {
    if (window.confirm(`Are you sure you want to unban ${user.username}?`)) {
      banEndUser.mutate({ userId: user._id, is_banned: false })
    }
  }

  const handleDeleteUser = (user: any) => {
    if (window.confirm(`Are you sure you want to delete ${user.username}? This will free up their license.`)) {
      deleteEndUser.mutate(user._id)
    }
  }

  const handleResetHwid = (user: any) => {
    if (window.confirm(`Are you sure you want to reset HWID for ${user.username}? This will allow them to login from a different device.`)) {
      resetClientHwid.mutate(user._id)
    }
  }

  const handleCreateUser = (data: { username: string; password: string; appId: string; hwid?: string | null; expiresAt: string }) => {
    createEndUser.mutate(data, {
      onSuccess: () => {
        setShowCreateUserDialog(false)
      }
    })
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy')
  }

  const getStats = () => {
    if (!users || !Array.isArray(users)) return { total: 0, active: 0, banned: 0, expired: 0 }
    
    const total = users.length
    const active = users.filter(u => !u.ban && new Date(u.expiresAt) > new Date()).length
    const banned = users.filter(u => u.ban).length
    const expired = users.filter(u => new Date(u.expiresAt) < new Date()).length

    return { total, active, banned, expired }
  }

  const stats = getStats()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground">End Users</h1>
            <p className="text-lg text-muted-foreground">
              Manage end users who have registered using your license keys.
            </p>
            {users && users.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  {stats.active} Active
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-destructive"></div>
                  {stats.banned} Banned
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-warning"></div>
                  {stats.expired} Expired
                </span>
              </div>
            )}
          </div>
          
          {/* Create End User Button */}
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCreateUserDialog(true)}
              className="flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Create End User
            </Button>
          </div>
        </div>
        
        {/* How End Users Register - Always Visible */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <UsersIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">How End Users Register</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Registration Process:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Generate license keys in the Licenses section</li>
                      <li>Distribute license keys to your end users</li>
                      <li>Users register at your app's registration endpoint</li>
                      <li>Once registered, they appear here for management</li>
                    </ol>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Registration Requirements:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Username and password</li>
                      <li>Valid license key</li>
                      <li>System information (for hardware binding)</li>
                      <li>License must not be expired or already used</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-3 p-3 rounded-lg bg-background/50 border">
                  <p className="text-xs text-muted-foreground">
                    <strong>Note:</strong> End users register themselves - you don't create accounts manually. 
                    Your role is to generate and distribute license keys, then manage users after they register.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <UsersIcon className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.total.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">End users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Users
            </CardTitle>
            <UserCheck className="w-4 h-4 text-success" />
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
              Banned Users
            </CardTitle>
            <Ban className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.banned.toLocaleString()}</div>
            <p className="text-sm text-destructive">Restricted access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expired Users
            </CardTitle>
            <Clock className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.expired.toLocaleString()}</div>
            <p className="text-sm text-warning">License expired</p>
          </CardContent>
        </Card>
      </div>



      {/* Management Info */}
      {users && users.length > 0 && (
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Ban className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">User Management Options</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground mb-1">Ban/Unban Users</p>
                    <p>Temporarily restrict user access without deleting their account. Banned users cannot login.</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Delete Users</p>
                    <p>Permanently remove user accounts and free up their license for reuse by others.</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Monitor Status</p>
                    <p>Track user activity, license expiration, and account status in real-time.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered End Users ({users?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users && users.length > 0 ? (
              users.map((user) => (
                <div key={user._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-smooth gap-3 sm:gap-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{user.username}</h3>
                        {getStatusBadge(user)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        App: {user.app?.name || 'Loading...'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Joined {formatDate(user.createdAt)} • Expires: {formatDate(user.expiresAt)}
                      </p>
                      {user.licenseKey && user.licenseKey.trim() && (
                        <p className="text-xs text-muted-foreground">
                          License: {user.licenseKey.substring(0, 16)}...
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="hidden lg:flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {user.ban ? 'Banned' : new Date(user.expiresAt) < new Date() ? 'Expired' : 'Active'}
                      </p>
                      <p className="text-xs text-muted-foreground">Status</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{formatDate(user.expiresAt)}</p>
                      <p className="text-xs text-muted-foreground">Expires</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {user.ban ? (
                          <DropdownMenuItem 
                            onClick={() => handleUnbanUser(user)}
                            disabled={banEndUser.isPending}
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Unban User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            onClick={() => handleBanUser(user)}
                            disabled={banEndUser.isPending}
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Ban User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleResetHwid(user)}
                          disabled={resetClientHwid.isPending}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Reset HWID
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteUser(user)}
                          className="text-destructive focus:text-destructive"
                          disabled={deleteEndUser.isPending}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="lg:hidden flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{formatDate(user.expiresAt)}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.ban ? 'Banned' : new Date(user.expiresAt) < new Date() ? 'Expired' : 'Active'}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {user.ban ? (
                          <DropdownMenuItem 
                            onClick={() => handleUnbanUser(user)}
                            disabled={banEndUser.isPending}
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Unban
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            onClick={() => handleBanUser(user)}
                            disabled={banEndUser.isPending}
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Ban
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleResetHwid(user)}
                          disabled={resetClientHwid.isPending}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Reset HWID
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteUser(user)}
                          className="text-destructive focus:text-destructive"
                          disabled={deleteEndUser.isPending}
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
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <UsersIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No End Users Yet</h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  End users will appear here after they register using your license keys. 
                  Start by generating license keys in the Licenses section.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/licenses'}
                    className="text-sm"
                  >
                    Go to Licenses
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => window.open('https://docs.example.com/registration', '_blank')}
                    className="text-sm"
                  >
                    View API Docs
                  </Button>
                </div>
              </div>
            )}          </div>
        </CardContent>
      </Card>

      {/* Create End User Dialog */}
      <CreateEndUserDialog
        open={showCreateUserDialog}
        onOpenChange={setShowCreateUserDialog}
        onSubmit={handleCreateUser}
        apps={apps}
        isLoading={createEndUser.isPending}
      />
    </div>
  )
}

export default Users