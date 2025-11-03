import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useApps } from '@/hooks/useApps';

export const useEndUsers = () => {
  const { isAuthenticated } = useAuth();
  const { data: appsData } = useApps();
  
  return useQuery({
    queryKey: ['endUsers'],
    queryFn: async () => {
      // Get all clients for all user's apps
      const apps = appsData?.apps || [];
      if (apps.length === 0) {
        return [];
      }
      
      // Fetch clients for each app and combine them
      const allClients = [];
      for (const app of apps) {
        try {
          const response = await apiClient.getClients({ app: app._id });
          if (response.success && response.data?.clients) {
            allClients.push(...response.data.clients);
          }
        } catch (error) {
          console.error(`Failed to fetch clients for app ${app.name}:`, error);
        }
      }
      
      return allClients;
    },
    enabled: isAuthenticated && !!appsData?.apps?.length,
    staleTime: 30000, // 30 seconds
  });
};

export const useBanEndUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, is_banned }: { userId: string; is_banned: boolean }) => {
      const response = await apiClient.banEndUser(userId, { is_banned });
      if (!response.success) {
        throw new Error(`Failed to ${is_banned ? 'ban' : 'unban'} user`);
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['endUsers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(variables.is_banned ? 'User Banned' : 'User Unbanned', {
        description: `User has been ${variables.is_banned ? 'banned' : 'unbanned'} successfully.`,
      });
    },
    onError: (error: any, variables) => {
      toast.error(`${variables.is_banned ? 'Ban' : 'Unban'} Failed`, {
        description: error.message || `Failed to ${variables.is_banned ? 'ban' : 'unban'} user.`,
      });
    },
  });
};

export const useDeleteEndUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.deleteEndUser(userId);
      if (!response.success) {
        throw new Error('Failed to delete user');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['endUsers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('User Deleted', {
        description: 'User has been permanently deleted and their license has been freed.',
      });
    },
    onError: (error: any) => {
      toast.error('Delete Failed', {
        description: error.message || 'Failed to delete user.',
      });
    },
  });
};

export const useCreateEndUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { username: string; password: string; appId: string; hwid?: string | null; expiresAt: string }) => {
      const response = await apiClient.createEndUser(data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to create user');
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['endUsers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('User Created', {
        description: `End user "${data.client.username}" has been created successfully.`,
      });
    },
    onError: (error: any) => {
      toast.error('Creation Failed', {
        description: error.message || 'Failed to create end user.',
      });
    },
  });
};

export const useResetClientHwid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientId: string) => {
      const response = await apiClient.resetClientHwid(clientId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to reset HWID');
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['endUsers'] });
      toast.success('HWID Reset', {
        description: `HWID for user "${data.client.username}" has been reset successfully.`,
      });
    },
    onError: (error: any) => {
      toast.error('Reset Failed', {
        description: error.message || 'Failed to reset HWID.',
      });
    },
  });
};