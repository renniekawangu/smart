import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { User } from '../types';
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const [isAuth, setIsAuth] = useState(authService.isAuthenticated());

  const { data: user, isLoading: isLoadingUser } = useQuery<User | null>({
    queryKey: ['currentUser', isAuth],
    queryFn: async () => {
      if (!isAuth) return null;
      try {
        return await authService.getCurrentUser();
      } catch (error) {
        console.error('Failed to fetch current user:', error);
        return null;
      }
    },
    enabled: isAuth,
    retry: false,
  });

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const result = await authService.register(data);
      console.log('✓ Register mutation succeeded. Token stored in localStorage:', !!localStorage.getItem('auth_token'));
      return result;
    },
    onSuccess: () => {
      console.log('🔄 onSuccess called. Updating isAuth to true');
      setIsAuth(true);
      // Force refetch immediately
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      }, 100);
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: any) => {
      const result = await authService.login(data);
      console.log('✓ Login mutation succeeded. Token stored in localStorage:', !!localStorage.getItem('auth_token'));
      return result;
    },
    onSuccess: () => {
      console.log('🔄 onSuccess called. Updating isAuth to true');
      setIsAuth(true);
      // Force refetch immediately
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      }, 100);
    },
  });

  const logout = () => {
    authService.logout();
    setIsAuth(false);
    queryClient.setQueryData(['currentUser'], null);
  };

  return {
    user,
    isLoadingUser,
    isAuthenticated: isAuth,
    register: registerMutation.mutateAsync,
    login: loginMutation.mutateAsync,
    logout,
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    registerError: registerMutation.error,
    loginError: loginMutation.error,
  };
};
