import { Request, Response } from 'express';
import { reviewService } from '../services/index';
import { successResponse, errorResponse } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import axios from 'axios';
import { SentimentLabel } from '../types/index';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000/api';

// Helper to analyze sentiment
const analyzeSentiment = async (text: string): Promise<{ sentiment: SentimentLabel; score: number }> => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/sentiment`, { text });
    return {
      sentiment: response.data.sentiment,
      score: response.data.score,
    };
  } catch (error) {
    // Fallback to simple sentiment analysis if ML service unavailable
    return {
      sentiment: text.length > 100 ? SentimentLabel.POSITIVE : SentimentLabel.NEUTRAL,
      score: 0.5,
    };
  }
};

export const reviewController = {
  createReview: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { lodgingId, rating, comment } = req.body;

      if (!lodgingId || rating === undefined || !comment) {
        res.status(400).json(errorResponse('Missing required fields'));
        return;
      }

      const { sentiment, score } = await analyzeSentiment(comment);

      const review = await reviewService.createReview({
        userId: req.userId || '',
        lodgingId,
        rating,
        comment,
        sentiment,
        sentimentScore: score,
      });

      res.status(201).json(successResponse(review));
    } catch (error) {
      res.status(500).json(errorResponse('Internal server error'));
    }
  },

  getReview: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const review = await reviewService.getReviewById(id);

      if (!review) {
        res.status(404).json(errorResponse('Review not found'));
        return;
      }

      res.json(successResponse(review));
    } catch (error) {
      res.status(500).json(errorResponse('Internal server error'));
    }
  },

  getLodgingReviews: async (req: Request, res: Response): Promise<void> => {
    try {
      const { lodgingId } = req.params;
      const reviews = await reviewService.getLodgingReviews(lodgingId);
      res.json(successResponse(reviews));
    } catch (error) {
      res.status(500).json(errorResponse('Internal server error'));
    }
  },

  getUserReviews: async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const reviews = await reviewService.getUserReviews(userId);
      res.json(successResponse(reviews));
    } catch (error) {
      res.status(500).json(errorResponse('Internal server error'));
    }
  },

  updateReview: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;

      let sentiment, score;
      if (comment) {
        const result = await analyzeSentiment(comment);
        sentiment = result.sentiment;
        score = result.score;
      }

      const review = await reviewService.updateReview(id, {
        rating,
        comment,
        sentiment,
        sentimentScore: score,
      });

      if (!review) {
        res.status(404).json(errorResponse('Review not found'));
        return;
      }

      res.json(successResponse(review));
    } catch (error) {
      res.status(500).json(errorResponse('Internal server error'));
    }
  },

  deleteReview: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await reviewService.deleteReview(id);

      if (!deleted) {
        res.status(404).json(errorResponse('Review not found'));
        return;
      }

      res.json(successResponse({ message: 'Review deleted' }));
    } catch (error) {
      res.status(500).json(errorResponse('Internal server error'));
    }
  },
};
