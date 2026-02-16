import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lodgingService } from '../services/lodgingService';
import { Lodging } from '../types';

export const useLodgings = (filters?: any) => {
  return useQuery({
    queryKey: ['lodgings', filters],
    queryFn: () => lodgingService.getLodgings(filters),
  });
};

export const useLodging = (id: string) => {
  return useQuery({
    queryKey: ['lodging', id],
    queryFn: () => lodgingService.getLodgingById(id),
    enabled: !!id,
  });
};

export const useCreateLodging = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => lodgingService.createLodging(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lodgings'] });
    },
  });
};

export const useUpdateLodging = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<Lodging>) => lodgingService.updateLodging(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lodging', id] });
      queryClient.invalidateQueries({ queryKey: ['lodgings'] });
    },
  });
};

export const useSearchLodgings = (query: string) => {
  return useQuery({
    queryKey: ['lodgings-search', query],
    queryFn: () => lodgingService.searchLodgings(query),
    enabled: !!query,
  });
};
