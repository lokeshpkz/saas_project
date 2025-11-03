import { useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Key,
  Store,
  User,
  Settings,
  Menu,
  LogOut,
  Crown
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useIsMobile } from "@/hooks/use-mobile"
import { useSidebar } from "@/hooks/use-sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { useApps } from "@/hooks/useApps"

const mainNavItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard
  },
  {
    title: "Resellers",
    url: "/resellers",
    icon: Store
  },
  {
    title: "Licenses",
    url: "/licenses",
    icon: Key
  },
  {
    title: "End Users",
    url: "/users",
    icon: Users
  },
]

const utilityNavItems = [
  {
    title: "Profile",
    url: "/profile",
    icon: User
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings
  },
  {
    title: "Subscription",
    url: "/subscription",
    icon: Crown
  },
]



export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar()
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { user, logout } = useAuth()
  const { data: apps } = useApps()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const handleLogout = () => {
    logout()
    navigate("/auth")
  }

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true
    if (path !== "/" && currentPath.startsWith(path)) return true
    return false
  }

  const renderNavItem = (item: typeof mainNavItems[0]) => {
    const isItemActive = isActive(item.url)
    const hasApps = apps && apps.apps && apps.apps.length > 0
    const isDisabled = !hasApps && (item.url === '/licenses' || item.url === '/resellers' || item.url === '/users')
    
    const baseClasses = "w-full justify-start gap-2 sm:gap-3 transition-smooth rounded-lg font-medium py-2.5 px-3 text-sm sm:text-base"
    const className = isItemActive
      ? `${baseClasses} bg-primary text-primary-foreground shadow-md`
      : isDisabled
      ? `${baseClasses} text-muted-foreground/50 cursor-not-allowed`
      : `${baseClasses} text-muted-foreground hover:bg-muted hover:text-foreground`

    return (
      <SidebarMenuButton
        className={className}
        onClick={() => !isDisabled && navigate(item.url)}
        disabled={isDisabled}
        title={isDisabled ? "Create an app first to access this section" : undefined}
      >
        <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
        {(!collapsed || !isMobile) && <span className="truncate">{item.title}</span>}
      </SidebarMenuButton>
    )
  }

  return (
    <Sidebar className="border-r bg-background md:bg-card/60 md:backdrop-blur-sm [&_[data-sidebar=sidebar]]:bg-background md:[&_[data-sidebar=sidebar]]:bg-card/60">
      <SidebarContent className="p-3 sm:p-4 lg:p-6">
        {/* Header with logo and toggle */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <button 
            onClick={() => navigate('/landing')}
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-primary rounded-lg sm:rounded-xl flex items-center justify-center shadow-glow">
              <Key className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            {(!collapsed || !isMobile) && (
              <div className="font-bold text-lg sm:text-xl text-foreground">
                Code<span className="text-primary">ryn</span>
              </div>
            )}
          </button>
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="w-8 h-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 sm:space-y-2">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {renderNavItem(item)}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Separator */}
        <SidebarSeparator className="my-4 sm:my-6" />

        {/* Utility Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 sm:space-y-2">
              {utilityNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {renderNavItem(item)}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Profile Section */}
        {user && (
          <>
            <SidebarSeparator className="my-4 sm:my-6" />
            <SidebarGroup>
              <SidebarGroupContent>
                <div className="space-y-3">
                  {/* User Info */}
                  {(!collapsed || !isMobile) && (
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email || ''}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Logout Button */}
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        className="w-full justify-start gap-2 sm:gap-3 transition-smooth rounded-lg font-medium py-2.5 px-3 text-sm sm:text-base text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        {(!collapsed || !isMobile) && <span className="truncate">Logout</span>}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
    </Sidebar>
  )
}