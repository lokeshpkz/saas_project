import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient, User, LoginRequest, RegisterRequest, AuthResponse } from '@/lib/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const isAuthenticated = !!user;

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          setIsLoading(true);
          const response = await apiClient.getMe();
          if (response.success && response.data) {
            setUser(response.data);
            // Invalidate queries to ensure fresh data
            queryClient.invalidateQueries({ queryKey: ['apps'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
          } else {
            // If response is not successful, remove the token
            localStorage.removeItem('authToken');
            setUser(null);
          }
        } catch (error: any) {
          console.error('Auth check failed:', error);
          // Remove invalid token
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [queryClient]);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiClient.login(credentials);
      
      if (response.success && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setUser(response.data.user);
        toast.success('Login Successful', {
          description: `Welcome back, ${response.data.user.name}!`,
        });
        
        // Invalidate and refetch relevant queries after login
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['apps'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        }, 500);
        
        return true;
      }
      
      toast.error('Login Failed', {
        description: 'Invalid credentials. Please try again.',
      });
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      // Remove any potentially invalid token
      localStorage.removeItem('authToken');
      setUser(null);
      
      // Check if it's a 401 or 404 error (authentication related)
      if (error.message && (error.message.includes('401') || error.message.includes('404') || error.message.includes('Not authorized'))) {
        toast.error('Session Expired', {
          description: 'Your session has expired. Please log in again.',
        });
      } else {
        toast.error('Login Failed', {
          description: error.message || 'An error occurred during login.',
        });
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiClient.register(userData);
      
      if (response.success && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setUser(response.data.user);
        toast.success('Registration Successful', {
          description: `Welcome to the License Management System, ${response.data.user.name}!`,
        });
        
        // Invalidate and refetch relevant queries after registration
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['apps'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        }, 500);
        
        return true;
      }
      
      toast.error('Registration Failed', {
        description: 'Failed to create account. Please try again.',
      });
      return false;
    } catch (error: any) {
      console.error('Registration error:', error);
      // Remove any potentially invalid token
      localStorage.removeItem('authToken');
      setUser(null);
      
      const errorMessage = error.message || 'An error occurred during registration.';
      
      // Check if it's a duplicate email error
      if (errorMessage.includes('already exists')) {
        toast.error('Email Already Registered', {
          description: errorMessage,
        });
      } else {
        toast.error('Registration Failed', {
          description: errorMessage,
        });
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    // Clear all cached queries on logout
    queryClient.clear();
    toast.success('Logged Out', {
      description: 'You have been successfully logged out.',
    });
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};