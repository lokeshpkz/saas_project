import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

export const useResellers = () => {
  return useQuery({
    queryKey: ['resellers'],
    queryFn: async () => {
      const response = await apiClient.getResellers();
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch resellers');
      }
      return response.data;
    },
    staleTime: 30000, // 30 seconds
  });
};

export const useCreateReseller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; password: string; app_id: string; allowed_license_keys: number }) => {
      const response = await apiClient.createReseller(data);
      if (!response.success) {
        throw new Error('Failed to create reseller');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resellers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Reseller account has been created successfully.');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create reseller.');
    },
  });
};

export const useUpdateReseller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ resellerId, data }: { resellerId: string; data: { allowed_license_keys: number } }) => {
      const response = await apiClient.updateReseller(resellerId, data);
      if (!response.success) {
        throw new Error('Failed to update reseller');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resellers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Reseller license limit has been updated successfully.');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update reseller.');
    },
  });
};

export const useDeleteReseller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resellerId: string) => {
      const response = await apiClient.deleteReseller(resellerId);
      if (!response.success) {
        throw new Error('Failed to delete reseller');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resellers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Reseller has been permanently deleted.');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete reseller.');
    },
  });
};