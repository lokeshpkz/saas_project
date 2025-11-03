import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Key, TrendingUp, Activity, Shield, Plus, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useResellerAuth } from "@/contexts/ResellerAuthContext"
import { useResellerLicenses } from "@/hooks/useResellerLicenses"

const ResellerDashboard = () => {
  const navigate = useNavigate()
  const { reseller } = useResellerAuth()
  const { licenses, stats, loading } = useResellerLicenses()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const dashboardStats = [
    {
      title: "Total Generated",
      value: stats.total.toString(),
      change: `${reseller?.remaining_licenses || 0} remaining`,
      trend: "up",
      icon: Key,
      color: "text-primary"
    },
    {
      title: "Active Licenses",
      value: stats.active.toString(),
      change: `${Math.round((stats.active / stats.total) * 100) || 0}% of total`,
      trend: "up",
      icon: CheckCircle,
      color: "text-success"
    },
    {
      title: "Used Licenses",
      value: stats.used.toString(),
      change: `${Math.round((stats.used / stats.total) * 100) || 0}% usage rate`,
      trend: "up",
      icon: Shield,
      color: "text-warning"
    }
  ]

  const recentActivity = licenses.slice(0, 5).map((license, index) => ({
    id: index,
    action: license.used ? "License activated" : "License generated",
    licenseId: license.key ? license.key.substring(0, 12) + "..." : "Unknown License",
    time: new Date(license.createdAt).toLocaleDateString(),
    status: license.used ? "info" : "success"
  }))

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Reseller Dashboard</h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mt-1">
            Welcome back, {reseller?.email}! Manage your license generation and track performance.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {dashboardStats.map((stat) => (
          <Card key={stat.title} className="transition-smooth hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs sm:text-sm text-muted-foreground">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <Card className="xl:col-span-2">
          <CardHeader className="px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-3 sm:space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg bg-muted/50 gap-2 sm:gap-0">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Key className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-xs sm:text-sm text-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.licenseId}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right">
                      <Badge 
                        variant={activity.status === 'success' ? 'default' : 
                                activity.status === 'warning' ? 'secondary' : 
                                activity.status === 'error' ? 'destructive' : 'outline'}
                        className="text-xs"
                      >
                        {activity.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground sm:mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Key className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No license activity yet</p>
                  <p className="text-sm text-muted-foreground">Generate your first license to see activity here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-4 sm:px-6">
            <button 
              onClick={() => navigate('/reseller/licenses')}
              className="w-full p-3 text-left rounded-lg bg-primary text-primary-foreground transition-smooth hover:bg-primary-hover"
            >
              <div className="font-medium text-sm sm:text-base">Generate License</div>
              <div className="text-xs sm:text-sm opacity-90">Create a new license key</div>
            </button>
            <button 
              onClick={() => navigate('/reseller/licenses')}
              className="w-full p-3 text-left rounded-lg bg-muted transition-smooth hover:bg-muted-hover"
            >
              <div className="font-medium text-sm sm:text-base">View All Licenses</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Manage existing licenses</div>
            </button>
            <button 
              onClick={() => navigate('/reseller/profile')}
              className="w-full p-3 text-left rounded-lg bg-muted transition-smooth hover:bg-muted-hover"
            >
              <div className="font-medium text-sm sm:text-base">Account Settings</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Update your profile</div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ResellerDashboard