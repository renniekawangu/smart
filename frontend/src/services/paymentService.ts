import axios from 'axios';
import { apiClient } from './api';

export const paymentService = {
  // Record cash payment for a booking
  recordCashPayment: async (bookingId: string, notes?: string) => {
    const { data } = await apiClient.post('/payments/record-cash', {
      bookingId,
      notes,
    });
    return data.data;
  },

  // Get payment summary for host
  getPaymentSummary: async () => {
    const { data } = await apiClient.get('/payments/summary');
    return data.data;
  },

  // Get payment history for host
  getPaymentHistory: async () => {
    const { data } = await apiClient.get('/payments/history');
    return data.data;
  },
};
