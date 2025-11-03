import React from 'react';
import { Navigate } from 'react-router-dom';
import { useResellerAuth } from '@/contexts/ResellerAuthContext';
import { ResellerLayout } from './ResellerLayout';
import { LoadingSpinner } from './LoadingSpinner';

interface ResellerProtectedLayoutProps {
  children: React.ReactNode;
}

export const ResellerProtectedLayout: React.FC<ResellerProtectedLayoutProps> = ({ children }) => {
  const { isAuthenticated, loading } = useResellerAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/reseller/auth" replace />;
  }

  return <ResellerLayout>{children}</ResellerLayout>;
};