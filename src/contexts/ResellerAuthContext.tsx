import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, ResellerUser, ResellerLoginRequest } from '@/lib/api';

interface ResellerAuthContextType {
    reseller: ResellerUser | null;
    loading: boolean;
    login: (credentials: ResellerLoginRequest) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    fetchResellerProfile: () => Promise<void>;
}

const ResellerAuthContext = createContext<ResellerAuthContextType | undefined>(undefined);

export const useResellerAuth = () => {
    const context = useContext(ResellerAuthContext);
    if (context === undefined) {
        throw new Error('useResellerAuth must be used within a ResellerAuthProvider');
    }
    return context;
};

export const ResellerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [reseller, setReseller] = useState<ResellerUser | null>(null);
    const [loading, setLoading] = useState(true);

    const login = async (credentials: ResellerLoginRequest): Promise<boolean> => {
        try {
            const response = await apiClient.resellerLogin(credentials);
            if (response.success && response.data?.token) {
                localStorage.setItem('resellerAuthToken', response.data.token);
                // Set reseller data from login response to avoid extra API call
                if (response.data.reseller) {
                    setReseller(response.data.reseller);
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('Reseller login failed:', error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('resellerAuthToken');
        setReseller(null);
    };

    const fetchResellerProfile = async () => {
        try {
            const token = localStorage.getItem('resellerAuthToken');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await apiClient.getResellerMe();
            if (response.success && response.data) {
                setReseller(response.data);
            } else {
                localStorage.removeItem('resellerAuthToken');
            }
        } catch (error) {
            console.error('Failed to fetch reseller profile:', error);
            localStorage.removeItem('resellerAuthToken');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResellerProfile();
    }, []);

    const value: ResellerAuthContextType = {
        reseller,
        loading,
        login,
        logout,
        isAuthenticated: !!reseller,
        fetchResellerProfile,
    };

    return (
        <ResellerAuthContext.Provider value={value}>
            {children}
        </ResellerAuthContext.Provider>
    );
};