import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, App, CreateAppRequest, UpdateAppRequest } from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useApps = () => {
  const { isAuthenticated } = useAuth();
  
  return useQuery<{ apps: App[]; count: number }, Error>({
    queryKey: ['apps'],
    queryFn: async () => {
      const response = await apiClient.getApps();
      return response.data || { apps: [], count: 0 };
    },
    enabled: isAuthenticated, // Only fetch when user is authenticated
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window gets focus
    staleTime: 30000, // Consider data stale after 30 seconds
  });
};

export const useToggleAppPause = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (appId: string) => apiClient.toggleAppPause(appId),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Update the apps cache
        queryClient.setQueryData<{ apps: App[]; count: number }>(['apps'], (oldData) => {
          if (!oldData) return { apps: [], count: 0 };
          return {
            ...oldData,
            apps: oldData.apps.map(app => 
              app._id === response.data!.app._id
                ? { ...app, paused: response.data!.app.paused } 
                : app
            )
          };
        });
        
        toast.success(`App ${response.data.app.paused ? 'paused' : 'resumed'} successfully`);
      }
    },
    onError: (error: Error) => {
      toast.error('Failed to toggle app pause state');
      console.error('Toggle app pause error:', error);
    }
  });
};

export const useCreateApp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAppRequest) => {
      const response = await apiClient.createApp(data);
      if (!response.success) {
        throw new Error('Failed to create app');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('App created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create app');
    },
  });
};

export const useUpdateApp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ appId, data }: { appId: string; data: UpdateAppRequest }) => {
      const response = await apiClient.updateApp(appId, data);
      if (!response.success) {
        throw new Error('Failed to update app');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('App updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update app');
    },
  });
};

export const useDeleteApp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appId: string) => {
      const response = await apiClient.deleteApp(appId);
      if (!response.success) {
        throw new Error('Failed to delete app');
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate all related queries since deleting an app cascades to resellers, licenses, and end users
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['resellers'] });
      queryClient.invalidateQueries({ queryKey: ['licenses'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('App and all associated data deleted successfully', {
        description: 'All resellers, licenses, and clients have been removed.'
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete app');
    },
  });
};

export const useGetApp = () => {
  return useMutation({
    mutationFn: async (appId: string) => {
      const response = await apiClient.getApp(appId);
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch app');
      }
      return response.data;
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to fetch app');
    },
  });
};