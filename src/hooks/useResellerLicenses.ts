import { useState, useEffect } from 'react';
import { apiClient, License, CreateResellerLicenseRequest } from '../lib/api';
import { useResellerAuth } from '../contexts/ResellerAuthContext';
import { toast } from 'sonner';

export const useResellerLicenses = () => {
    const [licenses, setLicenses] = useState<License[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { reseller } = useResellerAuth();

    const fetchLicenses = async () => {
        if (!reseller) return;
        
        try {
            setLoading(true);
            setError(null);
            const response = await apiClient.getResellerLicenses(reseller._id);
            if (response.success && response.data) {
                setLicenses(response.data);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch licenses';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const createLicenses = async (data: CreateResellerLicenseRequest): Promise<boolean> => {
        if (!reseller) return false;
        
        try {
            const response = await apiClient.createResellerLicenses(reseller._id, data);
            if (response.success && response.data) {
                setLicenses(prev => [...prev, ...response.data!]);
                toast.success(`${response.data.length} license(s) created successfully`);
                return true;
            }
            return false;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create licenses';
            toast.error(errorMessage);
            return false;
        }
    };

    const deleteAllLicenses = async (): Promise<boolean> => {
        if (!reseller) return false;
        
        try {
            const response = await apiClient.deleteAllResellerLicenses(reseller._id);
            if (response.success && response.data) {
                setLicenses([]);
                toast.success(response.message || `Successfully deleted ${response.data.deletedCount} license(s)`);
                return true;
            }
            return false;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete licenses';
            toast.error(errorMessage);
            return false;
        }
    };

    useEffect(() => {
        if (reseller) {
            fetchLicenses();
        }
    }, [reseller]);

    return {
        licenses,
        loading,
        error,
        fetchLicenses,
        createLicenses,
        deleteAllLicenses,
        stats: {
            total: licenses.length,
            active: licenses.filter(l => l.status === 'ACTIVE' && new Date(l.expiresAt) > new Date()).length,
            used: licenses.filter(l => l.used).length,
            expired: licenses.filter(l => l.status === 'EXPIRED' || new Date(l.expiresAt) <= new Date()).length,
        }
    };
};