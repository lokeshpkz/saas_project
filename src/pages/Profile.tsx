import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, Key, Calendar, CreditCard, Lock, Crown, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

const Profile = () => {
  const { user, isLoading } = useAuth();
  
  // Format limit display (handle -1 for unlimited and undefined values)
  const formatLimit = (limit: number | null | undefined) => {
    if (limit === null || limit === undefined || limit === -1) {
      return '∞';
    }
    return limit.toString();
  };

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  // If no user data available after loading, show error
  if (!user || !user.name || !user.email) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-2">Unable to load profile data</p>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const isPremium = user.plan === 'premium';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Profile</h1>
          <p className="text-lg text-muted-foreground">
            View your account information and platform statistics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mx-auto sm:mx-0">
                <span className="text-white text-xl sm:text-2xl font-bold">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  {user.name || 'User'}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {user.email || 'No email'}
                </p>
                <Badge className="bg-primary text-primary-foreground">
                  <Shield className="w-3 h-3 mr-1" />
                  {user.role === 'reseller' ? 'Reseller' : 'App Owner'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email || 'No email'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm text-foreground">Member Since</p>
                    <p className="text-sm text-muted-foreground">
                      {user.createdAt ? format(new Date(user.createdAt), 'MMMM d, yyyy') : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm text-foreground">Role</p>
                    <p className="text-sm text-muted-foreground">
                      {user.role === 'reseller' ? 'Reseller' : 'App Owner'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm text-foreground">Status</p>
                    <p className="text-sm text-success">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5" />
              Plan & Limits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="flex flex-col items-center gap-2">
                <Badge variant={isPremium ? "default" : "secondary"} className="text-sm">
                  <Crown className="w-3 h-3 mr-1" />
                  {isPremium ? 'Premium' : 'Free'} Plan
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {isPremium ? 'Unlimited access' : 'Limited features'}
                </p>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Max Apps</span>
                  <span>{formatLimit(user.maxApps)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Max Licenses/App</span>
                  <span>{formatLimit(user.maxLicensesPerApp)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Max Resellers</span>
                  <span>{formatLimit(user.maxResellers)}</span>
                </div>
              </div>
              
              {!isPremium && (
                <Button className="w-full mt-4" variant="default" size="sm" asChild>
                  <a href="/subscription">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">
                {user.apps?.length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Total Apps</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-success">
                {user.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
              </div>
              <p className="text-sm text-muted-foreground">Payment Status</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-warning">
                {isPremium ? 'Yes' : 'No'}
              </div>
              <p className="text-sm text-muted-foreground">Premium Access</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start gap-2">
              <Key className="w-4 h-4" />
              Change Password
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <Mail className="w-4 h-4" />
              Update Email
            </Button>
          </div>
          
          {!isPremium && (
            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-primary" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Upgrade to Premium</h3>
                  <p className="text-sm text-muted-foreground">
                    Get unlimited apps, licenses, and resellers with premium features.
                  </p>
                </div>
                <Button asChild>
                  <a href="/subscription">
                    Upgrade Now
                  </a>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;