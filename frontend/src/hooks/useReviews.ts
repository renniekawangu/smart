import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/reviewService';
import { Review } from '../types';

export const useReviews = (lodgingId: string) => {
  return useQuery({
    queryKey: ['reviews', lodgingId],
    queryFn: () => reviewService.getLodgingReviews(lodgingId),
    enabled: !!lodgingId,
  });
};

export const useUserReviews = (userId: string) => {
  return useQuery({
    queryKey: ['user-reviews', userId],
    queryFn: () => reviewService.getUserReviews(userId),
    enabled: !!userId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => reviewService.createReview(data),
    onSuccess: (review) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', review.lodgingId] });
      queryClient.invalidateQueries({ queryKey: ['user-reviews'] });
    },
  });
};

export const useUpdateReview = (reviewId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Review>) => reviewService.updateReview(reviewId, data),
    onSuccess: (review) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

export const useDeleteReview = (reviewId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => reviewService.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};
