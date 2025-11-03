import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

interface Settings {
    pauseApplications: boolean;
    hwidLock: boolean;
}

export const useSettings = () => {
    const [settings, setSettings] = useState<Settings>({ pauseApplications: false, hwidLock: true });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await apiClient.getSettings();
            if (response.success && response.data) {
                setSettings(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (newSettings: Partial<Settings>) => {
        try {
            setUpdating(true);
            const response = await apiClient.updateSettings(newSettings);
            if (response.success && response.data) {
                setSettings(response.data);
                toast.success('Settings updated successfully');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to update settings:', error);
            toast.error('Failed to update settings');
            return false;
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return {
        settings,
        loading,
        updating,
        updateSettings,
        fetchSettings
    };
};