import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useLicenses = () => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['licenses'],
    queryFn: async () => {
      const response = await apiClient.getLicenses();
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch licenses');
      }
      return response.data;
    },
    enabled: isAuthenticated,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 5000, // Reduced to 5 seconds for more responsive updates
  });
};

export const useUpdateLicense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ licenseId, data }: { licenseId: string; data: { expiresAt: string } }) => {
      const response = await apiClient.updateLicense(licenseId, data);
      if (!response.success) {
        throw new Error('Failed to update license');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('License Updated', {
        description: 'License expiry date has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast.error('Update Failed', {
        description: error.message || 'Failed to update license.',
      });
    },
  });
};

export const useDeleteLicense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (licenseId: string) => {
      const response = await apiClient.deleteLicense(licenseId);
      if (!response.success) {
        throw new Error('Failed to delete license');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('License Deleted', {
        description: 'License has been permanently deleted.',
      });
    },
    onError: (error: any) => {
      toast.error('Delete Failed', {
        description: error.message || 'Failed to delete license.',
      });
    },
  });
};

export const useDeleteAllLicenses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.deleteAllLicenses();
      if (!response.success) {
        throw new Error('Failed to delete all licenses');
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['licenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('All Licenses Deleted', {
        description: `Successfully deleted ${data.deletedCount} license(s).`,
      });
    },
    onError: (error: any) => {
      toast.error('Delete All Failed', {
        description: error.message || 'Failed to delete all licenses.',
      });
    },
  });
};