import { Response } from 'express';
import { availabilityService } from '../services/availabilityService';
import { lodgingService } from '../services/index';
import { successResponse, errorResponse } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export const availabilityController = {
  // Block dates
  blockDates: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json(errorResponse('Not authenticated'));
        return;
      }

      const { lodgingId, startDate, endDate, reason } = req.body;

      if (!lodgingId || !startDate || !endDate) {
        res.status(400).json(errorResponse('Missing required fields'));
        return;
      }

      // Verify host owns the lodging
      const lodging = await lodgingService.getLodgingById(lodgingId);
      if (!lodging || lodging.hostId !== req.userId) {
        res.status(403).json(errorResponse('Unauthorized'));
        return;
      }

      const blockedDate = await availabilityService.blockDates(lodgingId, startDate, endDate, reason);
      res.status(201).json(successResponse(blockedDate));
    } catch (error) {
      console.error('Error blocking dates:', error);
      res.status(500).json(errorResponse('Failed to block dates'));
    }
  },

  // Unblock dates
  unblockDates: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json(errorResponse('Not authenticated'));
        return;
      }

      const { blockedDateId } = req.params;

      if (!blockedDateId) {
        res.status(400).json(errorResponse('Blocked date ID required'));
        return;
      }

      const removed = await availabilityService.unblockDates(blockedDateId);

      if (!removed) {
        res.status(404).json(errorResponse('Blocked date not found'));
        return;
      }

      res.json(successResponse({ message: 'Dates unblocked successfully' }));
    } catch (error) {
      console.error('Error unblocking dates:', error);
      res.status(500).json(errorResponse('Failed to unblock dates'));
    }
  },

  // Get calendar data
  getCalendar: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json(errorResponse('Not authenticated'));
        return;
      }

      const { lodgingId } = req.params;

      if (!lodgingId) {
        res.status(400).json(errorResponse('Lodging ID required'));
        return;
      }

      // Verify host owns the lodging
      const lodging = await lodgingService.getLodgingById(lodgingId);
      if (!lodging || lodging.hostId !== req.userId) {
        res.status(403).json(errorResponse('Unauthorized'));
        return;
      }

      const calendarData = await availabilityService.getCalendarData(lodgingId);
      res.json(successResponse(calendarData));
    } catch (error) {
      console.error('Error fetching calendar:', error);
      res.status(500).json(errorResponse('Failed to fetch calendar'));
    }
  },

  // Check availability
  checkAvailability: async (req: Response): Promise<void> => {
    try {
      const { lodgingId, startDate, endDate } = req.query;

      if (!lodgingId || !startDate || !endDate) {
        res.status(400).json(errorResponse('Missing required parameters'));
        return;
      }

      const isAvailable = await availabilityService.isDateRangeAvailable(
        lodgingId as string,
        startDate as string,
        endDate as string
      );

      res.json(successResponse({ isAvailable }));
    } catch (error) {
      console.error('Error checking availability:', error);
      res.status(500).json(errorResponse('Failed to check availability'));
    }
  },
};
