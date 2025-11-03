import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, SubscriptionData } from '@/lib/api';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  subscription: SubscriptionData | null;
  loading: boolean;
  error: string | null;
  fetchSubscription: () => Promise<void>;
  createSubscriptionOrder: (plan: string, duration: string) => Promise<any>;
  verifySubscriptionPayment: (paymentData: any) => Promise<any>;
  cancelSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getSubscriptionStatus();
      setSubscription(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch subscription status');
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const createSubscriptionOrder = async (plan: string, duration: string) => {
    try {
      const response = await apiClient.createSubscriptionOrder({ plan, duration });
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create subscription order');
    }
  };

  const verifySubscriptionPayment = async (paymentData: any) => {
    try {
      const response = await apiClient.verifySubscriptionPayment(paymentData);
      // Update subscription state after successful payment
      setSubscription(response.data.user.subscription);
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to verify payment');
    }
  };

  const cancelSubscription = async () => {
    try {
      const response = await apiClient.cancelSubscription();
      // Update subscription state after cancellation
      setSubscription(response.data.user.subscription);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to cancel subscription');
    }
  };

  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user]);

  const value = {
    subscription,
    loading,
    error,
    fetchSubscription,
    createSubscriptionOrder,
    verifySubscriptionPayment,
    cancelSubscription
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};