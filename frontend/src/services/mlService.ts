import apiClient from './api';
import {
  RecommendationRequest,
  RecommendationResponse,
  PricePredictionRequest,
  PricePredictionResponse,
  SentimentAnalysisRequest,
  SentimentAnalysisResponse,
} from '../types';

const ML_BASE_URL = import.meta.env.VITE_ML_SERVICE_URL || 'http://localhost:8000/api';

export const mlService = {
  getRecommendations: async (request: RecommendationRequest): Promise<RecommendationResponse> => {
    const response = await apiClient.post(`${ML_BASE_URL}/recommendations`, request);
    return response.data;
  },

  predictPrice: async (request: PricePredictionRequest): Promise<PricePredictionResponse> => {
    const response = await apiClient.post(`${ML_BASE_URL}/price-prediction`, request);
    return response.data;
  },

  analyzeSentiment: async (request: SentimentAnalysisRequest): Promise<SentimentAnalysisResponse> => {
    const response = await apiClient.post(`${ML_BASE_URL}/sentiment`, request);
    return response.data;
  },
};
