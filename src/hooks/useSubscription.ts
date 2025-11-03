import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export const useSubscription = () => {
  const queryClient = useQueryClient();

  const { data: subscription, isLoading, error } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => apiClient.getSubscriptionStatus(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: plans, refetch: refetchPlans } = useQuery({
    queryKey: ['plans'],
    queryFn: () => apiClient.getPlans(),
    staleTime: 1 * 60 * 1000, // Reduce to 1 minute for more frequent updates
  });

  const createOrderMutation = useMutation({
    mutationFn: (data: { plan: string; duration: string; couponCode?: string }) => 
      apiClient.createSubscriptionOrder(data),
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: (data: any) => apiClient.verifySubscriptionPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: () => apiClient.cancelSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  // Get the premium plan from the plans data
  const premiumPlan = plans?.data?.find((plan: any) => plan.name === 'Premium');

  return {
    subscription: subscription?.data,
    plans: plans?.data,
    premiumPlan,
    isLoading,
    error,
    createOrder: createOrderMutation.mutateAsync,
    verifyPayment: verifyPaymentMutation.mutateAsync,
    cancelSubscription: cancelSubscriptionMutation.mutateAsync,
    isCreatingOrder: createOrderMutation.isPending,
    isVerifyingPayment: verifyPaymentMutation.isPending,
    isCancelling: cancelSubscriptionMutation.isPending,
    refetchPlans, // Expose refetch function
  };
};