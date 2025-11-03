import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Footer } from "./Footer"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col min-h-screen">
          {/* Mobile header */}
          <header className="md:hidden flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 border-b bg-card/80 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white text-xs sm:text-sm font-bold">R</span>
              </div>
              <span className="font-bold text-base sm:text-lg text-foreground">
                Code<span className="text-primary">ryn</span>
              </span>
            </div>
            <SidebarTrigger />
          </header>

          {/* Content */}
          <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>

          {/* Footer */}
          <Footer />
        </main>
      </div>
    </SidebarProvider>
  )
}