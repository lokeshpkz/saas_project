import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ResellerAuthProvider } from "./contexts/ResellerAuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { ProtectedLayout } from "./components/ProtectedLayout";
import { ResellerProtectedLayout } from "./components/ResellerProtectedLayout";
import Dashboard from "./pages/Dashboard";
import Resellers from "./pages/Resellers";
import Licenses from "./pages/Licenses";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import About from "./pages/About";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ResellerAuth from "./pages/ResellerAuth";
import ResellerDashboard from "./pages/ResellerDashboard";
import ResellerLicenses from "./pages/ResellerLicenses";
import ResellerProfile from "./pages/ResellerProfile";
import Subscription from "./pages/Subscription";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      staleTime: 30000, // 30 seconds
      gcTime: 300000, // 5 minutes (was cacheTime)
    },
  },
});

const App = () => {
  // Apply theme on app initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      const root = window.document.documentElement
      root.classList.remove("light", "dark")
      if (savedTheme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        root.classList.add(systemTheme)
      } else {
        root.classList.add(savedTheme)
      }
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ResellerAuthProvider>
          <SubscriptionProvider>
            <TooltipProvider>
              <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Toaster />
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/landing" element={<Landing />} />
                  <Route path="/auth" element={<Auth />} />
                  
                  {/* Protected Main Admin Portal Routes */}
                  <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
                  <Route path="/resellers" element={<ProtectedLayout><Resellers /></ProtectedLayout>} />
                  <Route path="/licenses" element={<ProtectedLayout><Licenses /></ProtectedLayout>} />
                  <Route path="/users" element={<ProtectedLayout><Users /></ProtectedLayout>} />
                  <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
                  <Route path="/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />
                  <Route path="/subscription" element={<ProtectedLayout><Subscription /></ProtectedLayout>} />
                  <Route path="/about" element={<ProtectedLayout><About /></ProtectedLayout>} />
                  <Route path="/terms" element={<ProtectedLayout><TermsOfService /></ProtectedLayout>} />
                  <Route path="/privacy" element={<ProtectedLayout><PrivacyPolicy /></ProtectedLayout>} />

                  {/* Reseller Portal Routes */}
                  <Route path="/reseller/auth" element={<ResellerAuth />} />
                  <Route path="/reseller/dashboard" element={<ResellerProtectedLayout><ResellerDashboard /></ResellerProtectedLayout>} />
                  <Route path="/reseller/licenses" element={<ResellerProtectedLayout><ResellerLicenses /></ResellerProtectedLayout>} />
                  <Route path="/reseller/profile" element={<ResellerProtectedLayout><ResellerProfile /></ResellerProtectedLayout>} />

                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </SubscriptionProvider>
        </ResellerAuthProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
};

export default App;