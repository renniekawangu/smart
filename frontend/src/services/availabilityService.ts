import { apiClient } from './api';

export const availabilityService = {
  // Block dates
  blockDates: async (lodgingId: string, startDate: string, endDate: string, reason?: string) => {
    const { data } = await apiClient.post('/availability/block', {
      lodgingId,
      startDate,
      endDate,
      reason,
    });
    return data.data;
  },

  // Unblock dates
  unblockDates: async (blockedDateId: string) => {
    const { data } = await apiClient.delete(`/availability/block/${blockedDateId}`);
    return data.data;
  },

  // Get calendar data
  getCalendar: async (lodgingId: string) => {
    const { data } = await apiClient.get(`/availability/calendar/${lodgingId}`);
    return data.data;
  },

  // Check availability
  checkAvailability: async (lodgingId: string, startDate: string, endDate: string) => {
    const { data } = await apiClient.get('/availability/check', {
      params: { lodgingId, startDate, endDate },
    });
    return data.data.isAvailable;
  },
};
