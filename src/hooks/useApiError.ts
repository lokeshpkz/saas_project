import { toast } from '@/lib/toast';

export const useApiError = () => {
  const handleError = (error: any, defaultMessage = 'An error occurred') => {
    const message = error?.message || defaultMessage;
    toast('Error', {
      description: message,
    });
    console.error('API Error:', error);
  };

  return { handleError };
};