import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ResellerSidebar } from "@/components/ResellerSidebar"
import { Footer } from "./Footer"
import { Button } from "@/components/ui/button"

interface ResellerLayoutProps {
    children: React.ReactNode
}

export function ResellerLayout({ children }: ResellerLayoutProps) {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gradient-subtle">
                <ResellerSidebar />

                <main className="flex-1 flex flex-col min-h-screen">
                    {/* Mobile header */}
                    <header className="md:hidden flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 border-b bg-card/80 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-primary rounded-lg flex items-center justify-center">
                                <span className="text-white text-xs sm:text-sm font-bold">R</span>
                            </div>
                            <span className="font-bold text-base sm:text-lg text-foreground">
                                Reseller<span className="text-primary">Portal</span>
                            </span>
                        </div>
                        <SidebarTrigger />
                    </header>

                    {/* Desktop header indicator */}
                    <header className="hidden md:flex items-center justify-between h-12 px-6 border-b bg-primary/5 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-gradient-primary rounded flex items-center justify-center">
                                <span className="text-white text-xs font-bold">R</span>
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">
                                Reseller Portal - Independent License Management
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open('/', '_blank')}
                            className="text-xs text-muted-foreground hover:text-foreground"
                        >
                            Open Main Portal
                        </Button>
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