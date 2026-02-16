// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  preferences?: UserPreferences;
  createdAt: string;
}

export interface UserPreferences {
  budget: {
    min: number;
    max: number;
  };
  location: string;
  amenities: string[];
  roomType: string;
  notifications: boolean;
}

export interface AuthPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Lodging types
export interface Lodging {
  id: string;
  name: string;
  description: string;
  location: {
    address: string;
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  amenities: string[];
  price: number;
  basePrice: number;
  predictedPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  availability: AvailabilitySlot[];
  sentimentScore?: number;
  createdAt: string;
}

export interface AvailabilitySlot {
  date: string;
  available: boolean;
  rooms: number;
}

// Booking types
export interface Booking {
  id: string;
  userId: string;
  lodgingId: string;
  hostId?: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  status: BookingStatus;
  paymentMethod?: 'cash' | 'card';
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  paymentDate?: Date | null;
  notes?: string;
  createdAt: string;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

// Review types
export interface Review {
  id: string;
  userId: string;
  lodgingId: string;
  rating: number;
  comment: string;
  sentiment: SentimentLabel;
  sentimentScore: number;
  createdAt: string;
}

export enum SentimentLabel {
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative'
}

// ML Request/Response types
export interface RecommendationRequest {
  userId: string;
  limit: number;
}

export interface RecommendationResponse {
  recommendations: Array<{
    lodgingId: string;
    score: number;
    reason: string;
  }>;
  evaluationMetrics?: {
    precision: number;
    recall: number;
    f1Score: number;
  };
}

export interface PricePredictionRequest {
  lodgingId: string;
  checkInDate: string;
  checkOutDate: string;
  seasonalFactor?: number;
}

export interface PricePredictionResponse {
  predictedPrice: number;
  confidence: number;
  factors: {
    basePrice: number;
    seasonalMultiplier: number;
    demandMultiplier: number;
  };
}

export interface SentimentAnalysisRequest {
  text: string;
}

export interface SentimentAnalysisResponse {
  sentiment: SentimentLabel;
  confidence: number;
  score: number;
}
