// User types
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'client' | 'host';
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  budget?: {
    min: number;
    max: number;
  };
  location?: string;
  amenities?: string[];
  roomType?: string;
  notifications?: boolean;
}

// Lodging types
export interface Lodging {
  id: string;
  name: string;
  title?: string;
  description: string;
  hostId: string;
  location: {
    address: string;
    city: string;
    country?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  amenities: string[];
  price: number;
  basePrice: number;
  rating: number;
  reviewCount: number;
  images: string[];
  availability: AvailabilitySlot[];
  createdAt: Date;
  updatedAt: Date;
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
  hostId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  status: BookingStatus;
  paymentMethod: 'cash' | 'card';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
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
  createdAt: Date;
  updatedAt: Date;
}

export enum SentimentLabel {
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative',
}
