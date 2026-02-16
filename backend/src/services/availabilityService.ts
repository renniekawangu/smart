import { BlockedDateModel } from '../models/BlockedDate';
import { bookingService } from './index';

export const availabilityService = {
  // Block dates for a lodging
  blockDates: async (lodgingId: string, startDate: string, endDate: string, reason: string = 'Blocked'): Promise<any> => {
    const blockedDate = new BlockedDateModel({
      lodgingId,
      startDate,
      endDate,
      reason,
    });
    await blockedDate.save();
    return blockedDate.toObject();
  },

  // Unblock dates
  unblockDates: async (blockedDateId: string): Promise<boolean> => {
    const result = await BlockedDateModel.deleteOne({ _id: blockedDateId });
    return result.deletedCount > 0;
  },

  // Get blocked dates for a lodging
  getBlockedDates: async (lodgingId: string): Promise<any[]> => {
    const blockedDates = await BlockedDateModel.find({ lodgingId });
    return blockedDates.map(bd => bd.toObject());
  },

  // Check if date range is available (not booked and not blocked)
  isDateRangeAvailable: async (lodgingId: string, startDate: string, endDate: string): Promise<boolean> => {
    // Check for bookings
    const bookingConflict = await bookingService.checkAvailability(lodgingId, startDate, endDate);
    if (!bookingConflict) return false;

    // Check for blocked dates
    const blockedCount = await BlockedDateModel.countDocuments({
      lodgingId,
      $or: [
        {
          startDate: { $lt: endDate },
          endDate: { $gt: startDate },
        },
      ],
    });

    return blockedCount === 0;
  },

  // Get calendar data (bookings + blocked dates)
  getCalendarData: async (lodgingId: string): Promise<{
    bookings: any[];
    blockedDates: any[];
  }> => {
    const bookings = await bookingService.getBookingsByLodging(lodgingId);
    const blockedDates = await availabilityService.getBlockedDates(lodgingId);

    return {
      bookings: bookings.map(b => ({
        id: b.id,
        type: 'booking',
        startDate: b.checkInDate,
        endDate: b.checkOutDate,
        status: b.status,
        title: `Booking (${b.status})`,
        color: b.status === 'confirmed' ? '#4CAF50' : b.status === 'cancelled' ? '#999' : '#FFC107',
      })),
      blockedDates: blockedDates.map(bd => ({
        id: bd._id,
        type: 'blocked',
        startDate: bd.startDate,
        endDate: bd.endDate,
        reason: bd.reason,
        title: `Blocked: ${bd.reason}`,
        color: '#F44336',
      })),
    };
  },
};
