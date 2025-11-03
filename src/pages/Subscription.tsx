import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { Check, X, Calendar, CreditCard, RefreshCw, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { loadRazorpay } from '@/lib/utils';
import { apiClient } from '@/lib/api';

const Subscription = () => {
  const { subscription, premiumPlan, isLoading, createOrder, verifyPayment, refetchPlans } = useSubscription();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pricing, setPricing] = useState<any>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

  // Fetch pricing data
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await apiClient.getPricing();
        setPricing(response.data);
      } catch (error) {
        console.error('Failed to fetch pricing:', error);
      }
    };
    fetchPricing();
  }, []);

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    
    try {
      setIsCheckingCoupon(true);
      const response = await apiClient.validateCoupon(couponCode.trim());
      
      if (response.success) {
        setAppliedCoupon({
          code: response.data.couponCode,
          discount: response.data.discount
        });
        toast.success(response.message);
      }
    } catch (error: any) {
      setAppliedCoupon(null);
      toast.error(error.message || 'Invalid coupon code');
    } finally {
      setIsCheckingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
  };

  const handleSubscribe = async (plan: string, duration: string) => {
    try {
      setProcessing(true);
      
      // Load Razorpay script
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) {
        toast.error('Failed to load payment gateway. Please try again.');
        setProcessing(false);
        return;
      }

      // Create order with coupon if applied
      const orderData = {
        plan,
        duration,
        ...(appliedCoupon && { couponCode: appliedCoupon.code })
      };
      
      const orderResponse = await createOrder(orderData);
      const order = orderResponse.data;
      
      // Check if this is a development/mock order
      if (order.isDevelopmentMode || order.orderId.startsWith('order_mock_')) {
        // Handle mock payment - simulate successful payment
        toast.success('Mock payment successful! Upgrading to premium...');
        
        // Simulate successful payment verification for development
        try {
          await verifyPayment({
            razorpayPaymentId: 'pay_mock_' + Date.now(),
            razorpayOrderId: order.orderId,
            razorpaySignature: 'mock_signature_' + Date.now(),
            plan,
            duration,
            ...(appliedCoupon && { couponCode: appliedCoupon.code })
          });
          
          toast.success('Subscription activated successfully!');
        } catch (error: any) {
          toast.error(error.message || 'Failed to verify mock payment');
        }
        
        setProcessing(false);
        return;
      }
      
      // Configure Razorpay options for real payments
      const options = {
        key: order.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: order.amount,
        currency: order.currency,
        name: 'Coderyn',
        description: `${plan} ${duration} subscription${appliedCoupon ? ` with coupon ${appliedCoupon.code}` : ''}`,
        order_id: order.orderId,
        handler: async function (response: any) {
          try {
            setProcessing(true);
            // Verify payment
            await verifyPayment({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              plan,
              duration,
              ...(appliedCoupon && { couponCode: appliedCoupon.code })
            });
            
            toast.success('Subscription activated successfully!');
          } catch (error: any) {
            toast.error(error.message || 'Failed to verify payment');
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
            toast.info('Payment cancelled');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: '#3399cc'
        }
      };

      // Open Razorpay checkout
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error(error.message || 'Failed to initiate subscription');
    } finally {
      setProcessing(false);
    }
  };

  const handleRefreshPlans = async () => {
    try {
      setRefreshing(true);
      await refetchPlans();
      toast.success('Plans refreshed successfully!');
    } catch (error) {
      toast.error('Failed to refresh plans');
    } finally {
      setRefreshing(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  const isPremium = subscription?.hasActiveSubscription;
  const planName = isPremium ? 'Premium' : 'Free';
  const expiryDate = subscription?.expiryDate;

      // Get prices from the pricing API or fallback to defaults
  const monthlyPrice = pricing?.plans?.premium_monthly?.priceFormatted || '₹699';
  const yearlyPrice = pricing?.plans?.premium_yearly?.priceFormatted || '₹1199';
  const yearlySavings = pricing?.plans?.premium_yearly?.savings?.amountFormatted || '₹989';
  const yearlySavingsPercent = pricing?.plans?.premium_yearly?.savings?.percentage || 17;

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Subscription</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your subscription plan and billing information
          </p>
        </div>
        <Button variant="outline" size="default" onClick={handleRefreshPlans} disabled={refreshing} className="self-start sm:self-auto min-h-[40px] px-4">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh Plans</span>
          <span className="sm:hidden">Refresh</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Current Plan */}
        <Card className="order-1">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">Current Plan</CardTitle>
            <CardDescription className="text-sm">
              Your current subscription details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-semibold text-foreground">{planName} Plan</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {isPremium ? 'Unlimited apps and licenses' : 'Limited to 2 apps and 30 licenses per app'}
                </p>
              </div>
              <Badge variant={isPremium ? 'default' : 'secondary'} className="self-start sm:self-auto">
                {isPremium ? 'ACTIVE' : 'FREE'}
              </Badge>
            </div>
            
            {isPremium && expiryDate && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Expires on {formatDate(expiryDate)}</span>
              </div>
            )}
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm sm:text-base">Plan Features</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-3 h-3 sm:h-4 sm:w-4 text-success flex-shrink-0" />
                  <span>License key generation</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-3 h-3 sm:h-4 sm:w-4 text-success flex-shrink-0" />
                  <span>Reseller management</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-3 h-3 sm:h-4 sm:w-4 text-success flex-shrink-0" />
                  <span>End user tracking</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  {isPremium ? (
                    <Check className="h-3 h-3 sm:h-4 sm:w-4 text-success flex-shrink-0" />
                  ) : (
                    <X className="h-3 h-3 sm:h-4 sm:w-4 text-destructive flex-shrink-0" />
                  )}
                  <span>Unlimited apps {isPremium ? '(Unlimited)' : '(Limited to 2)'}</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  {isPremium ? (
                    <Check className="h-3 h-3 sm:h-4 sm:w-4 text-success flex-shrink-0" />
                  ) : (
                    <X className="h-3 h-3 sm:h-4 sm:w-4 text-destructive flex-shrink-0" />
                  )}
                  <span>Unlimited licenses per app {isPremium ? '(Unlimited)' : '(Limited to 30)'}</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Options */}
        <Card className="order-2">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">Upgrade Your Plan</CardTitle>
            <CardDescription className="text-sm">
              Unlock all features with a premium subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground">Premium Plan</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">Unlock unlimited features</p>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="text-xl sm:text-2xl font-bold text-foreground">{monthlyPrice}<span className="text-xs sm:text-sm font-normal">/month</span></div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">or {yearlyPrice}/year (Save {yearlySavings})</p>
                    {yearlySavingsPercent && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        {yearlySavingsPercent}% OFF Yearly
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 h-3 sm:h-4 sm:w-4 text-success flex-shrink-0" />
                    <span>Unlimited apps</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 h-3 sm:h-4 sm:w-4 text-success flex-shrink-0" />
                    <span>Unlimited licenses per app</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 h-3 sm:h-4 sm:w-4 text-success flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 h-3 sm:h-4 sm:w-4 text-success flex-shrink-0" />
                    <span>Advanced analytics</span>
                  </li>
                </ul>
                
                {/* Coupon Code Section */}
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm sm:text-base mb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Coupon Code
                  </h4>
                  
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-success/10 border border-success/20 rounded-md p-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-success">{appliedCoupon.code}</span>
                        <Badge variant="secondary" className="text-xs">{appliedCoupon.discount}% OFF</Badge>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="default" 
                        onClick={removeCoupon}
                        className="h-8 w-8 p-0 min-h-[32px] min-w-[32px]"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                      <div className="flex-1">
                        <Input
                          type="text"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="text-sm w-full min-h-[40px]"
                          disabled={isCheckingCoupon}
                        />
                      </div>
                      <Button 
                        type="button" 
                        size="default" 
                        onClick={validateCoupon}
                        disabled={isCheckingCoupon || !couponCode.trim()}
                        className="text-sm w-full sm:w-auto min-h-[40px] px-4"
                      >
                        {isCheckingCoupon ? 'Checking...' : 'Apply'}
                      </Button>
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    Valid coupons: SAVE10 (10% off), SAVE20 (20% off), SAVE25 (25% off), WELCOME (15% off), LAUNCH (30% off)
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button 
                    className="flex-1 text-sm sm:text-base min-h-[44px] px-4 py-2"
                    onClick={() => handleSubscribe('premium', 'monthly')}
                    disabled={isPremium || processing}
                  >
                    <CreditCard className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate hidden sm:inline">{processing ? 'Processing...' : `Monthly ${monthlyPrice}`}</span>
                    <span className="truncate sm:hidden">{processing ? 'Processing...' : `${monthlyPrice}`}</span>
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1 text-sm sm:text-base min-h-[44px] px-4 py-2"
                    onClick={() => handleSubscribe('premium', 'yearly')}
                    disabled={isPremium || processing}
                  >
                    <CreditCard className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate hidden sm:inline">{processing ? 'Processing...' : `Yearly ${yearlyPrice}`}</span>
                    <span className="truncate sm:hidden">{processing ? 'Processing...' : `${yearlyPrice}`}</span>
                  </Button>
                </div>
                
                {isPremium && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    You're already on the premium plan
                  </p>
                )}
              </div>
              
              <div className="text-center text-xs sm:text-sm text-muted-foreground space-y-2">
                <p>All plans include a 7-day money-back guarantee</p>
                <div className="flex flex-wrap justify-center gap-4 text-xs">
                  <a 
                    href="https://merchant.razorpay.com/policy/RJKSTuorZtCDDN/shipping" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors underline"
                  >
                    Shipping Policy
                  </a>
                  <a 
                    href="https://merchant.razorpay.com/policy/RJKSTuorZtCDDN/refund" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors underline"
                  >
                    Refund Policy
                  </a>
                  <a 
                    href="https://merchant.razorpay.com/policy/RJKSTuorZtCDDN/terms" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors underline"
                  >
                    Payment Terms
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscription;