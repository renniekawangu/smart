import { User, Lodging, Booking, Review, BookingStatus, SentimentLabel } from '../types/index';
import { UserModel } from '../models/User';
import { LodgingModel } from '../models/Lodging';
import { BookingModel } from '../models/Booking';
import { ReviewModel } from '../models/Review';
import { hashPassword } from '../utils/password';

// User Service
export const userService = {
  createUser: async (name: string, email: string, passwordHash: string): Promise<User> => {
    const user = new UserModel({
      name,
      email,
      passwordHash,
    });
    await user.save();
    return user.toObject({ virtuals: true }) as User;
  },

  getUserById: async (id: string): Promise<User | null> => {
    const user = await UserModel.findById(id);
    return user ? (user.toObject({ virtuals: true }) as User) : null;
  },

  getUserByEmail: async (email: string): Promise<User | null> => {
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    return user ? (user.toObject({ virtuals: true }) as User) : null;
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<User | null> => {
    const user = await UserModel.findByIdAndUpdate(id, updates, { new: true });
    return user ? (user.toObject({ virtuals: true }) as User) : null;
  },

  getAllUsers: async (): Promise<User[]> => {
    const users = await UserModel.find();
    return users.map(u => u.toObject({ virtuals: true })) as User[];
  },

  deleteUser: async (id: string): Promise<boolean> => {
    const result = await UserModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  },
};

// Lodging Service
export const lodgingService = {
  createLodging: async (data: Omit<Lodging, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lodging> => {
    const lodging = new LodgingModel(data);
    await lodging.save();
    return lodging.toObject({ virtuals: true }) as Lodging;
  },

  getLodgingById: async (id: string): Promise<Lodging | null> => {
    const lodging = await LodgingModel.findById(id);
    return lodging ? (lodging.toObject({ virtuals: true }) as Lodging) : null;
  },

  getAllLodgings: async (filters?: {
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    amenities?: string[];
    limit?: number;
    offset?: number;
  }): Promise<{ lodgings: Lodging[]; total: number }> => {
    const query: any = {};

    if (filters?.city) {
      query['location.city'] = { $regex: filters.city, $options: 'i' };
    }
    if (filters?.minPrice !== undefined) {
      query.price = { ...query.price, $gte: filters.minPrice };
    }
    if (filters?.maxPrice !== undefined) {
      query.price = { ...query.price, $lte: filters.maxPrice };
    }
    if (filters?.amenities?.length) {
      query.amenities = { $in: filters.amenities };
    }

    const total = await LodgingModel.countDocuments(query);
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 20;

    const lodgings = await LodgingModel.find(query)
      .skip(offset)
      .limit(limit);

    return {
      lodgings: lodgings.map(l => l.toObject({ virtuals: true })) as Lodging[],
      total,
    };
  },

  updateLodging: async (id: string, updates: Partial<Lodging>): Promise<Lodging | null> => {
    const lodging = await LodgingModel.findByIdAndUpdate(id, updates, { new: true });
    return lodging ? (lodging.toObject({ virtuals: true }) as Lodging) : null;
  },

  deleteLodging: async (id: string): Promise<boolean> => {
    const result = await LodgingModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  },

  getLodgingsByHost: async (hostId: string): Promise<Lodging[]> => {
    const lodgings = await LodgingModel.find({ hostId });
    return lodgings.map(l => l.toObject({ virtuals: true })) as Lodging[];
  },
};

// Booking Service
export const bookingService = {
  createBooking: async (data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> => {
    const booking = new BookingModel(data);
    await booking.save();
    return booking.toObject({ virtuals: true }) as Booking;
  },

  getBookingById: async (id: string): Promise<Booking | null> => {
    const booking = await BookingModel.findById(id);
    return booking ? (booking.toObject({ virtuals: true }) as Booking) : null;
  },

  getUserBookings: async (userId: string): Promise<Booking[]> => {
    const bookings = await BookingModel.find({ userId });
    return bookings.map(b => b.toObject({ virtuals: true })) as Booking[];
  },

  updateBookingStatus: async (id: string, status: BookingStatus): Promise<Booking | null> => {
    const booking = await BookingModel.findByIdAndUpdate(id, { status }, { new: true });
    return booking ? (booking.toObject({ virtuals: true }) as Booking) : null;
  },

  updateBooking: async (id: string, updates: Partial<Booking>): Promise<Booking | null> => {
    const booking = await BookingModel.findByIdAndUpdate(id, updates, { new: true });
    return booking ? (booking.toObject({ virtuals: true }) as Booking) : null;
  },

  checkAvailability: async (lodgingId: string, checkIn: string, checkOut: string): Promise<boolean> => {
    const bookingConflicts = await BookingModel.countDocuments({
      lodgingId,
      status: { $ne: BookingStatus.CANCELLED },
      checkInDate: { $lt: checkOut },
      checkOutDate: { $gt: checkIn },
    });

    return bookingConflicts === 0;
  },

  getBookingsByHost: async (hostId: string): Promise<Booking[]> => {
    const bookings = await BookingModel.find({ hostId });
    return bookings.map(b => b.toObject({ virtuals: true })) as Booking[];
  },

  getBookingsByLodging: async (lodgingId: string): Promise<Booking[]> => {
    const bookings = await BookingModel.find({ lodgingId });
    return bookings.map(b => b.toObject({ virtuals: true })) as Booking[];
  },
};

// Review Service
export const reviewService = {
  createReview: async (data: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> => {
    const review = new ReviewModel(data);
    await review.save();

    // Update lodging rating
    const lodgingReviews = await ReviewModel.find({ lodgingId: data.lodgingId });
    if (lodgingReviews.length > 0) {
      const avgRating = lodgingReviews.reduce((sum, r) => sum + r.rating, 0) / lodgingReviews.length;
      await lodgingService.updateLodging(data.lodgingId, {
        rating: avgRating,
        reviewCount: lodgingReviews.length,
      });
    }

    return review.toObject({ virtuals: true }) as Review;
  },

  getReviewById: async (id: string): Promise<Review | null> => {
    const review = await ReviewModel.findById(id);
    return review ? (review.toObject({ virtuals: true }) as Review) : null;
  },

  getLodgingReviews: async (lodgingId: string): Promise<Review[]> => {
    const reviews = await ReviewModel.find({ lodgingId });
    return reviews.map(r => r.toObject({ virtuals: true })) as Review[];
  },

  getUserReviews: async (userId: string): Promise<Review[]> => {
    const reviews = await ReviewModel.find({ userId });
    return reviews.map(r => r.toObject({ virtuals: true })) as Review[];
  },

  updateReview: async (id: string, updates: Partial<Review>): Promise<Review | null> => {
    const review = await ReviewModel.findByIdAndUpdate(id, updates, { new: true });
    return review ? (review.toObject({ virtuals: true }) as Review) : null;
  },

  deleteReview: async (id: string): Promise<boolean> => {
    const result = await ReviewModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  },
};

// Seed initial data
export const seedDatabase = async () => {
  try {
    // Check if users already exist
    const existingUserCount = await UserModel.countDocuments();
    if (existingUserCount > 0) {
      console.log('Database already has users, skipping seed');
      return;
    }

    console.log('Seeding database with admin, host users and sample lodgings...');

    // Create admin user
    const adminPasswordHash = await hashPassword('admin123');
    const adminUser = new UserModel({
      name: 'Admin',
      email: 'admin@smartlodging.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
    });
    await adminUser.save();
    const adminId = adminUser._id.toString();
    console.log('✓ Admin user created (admin@smartlodging.com / admin123)');

    // Create host user
    const hostPasswordHash = await hashPassword('host123');
    const hostUser = new UserModel({
      name: 'Host Demo',
      email: 'host@smartlodging.com',
      passwordHash: hostPasswordHash,
      role: 'host',
    });
    await hostUser.save();
    const hostId = hostUser._id.toString();
    console.log('✓ Host user created (host@smartlodging.com / host123)');

    // Create sample lodgings (assigned to host)
    const existingLodgingCount = await LodgingModel.countDocuments();
    if (existingLodgingCount > 0) {
      console.log('Database already has lodgings, skipping lodging seed');
      return;
    }

    console.log('Seeding database with sample lodgings...');

    // Create sample lodgings
  await lodgingService.createLodging({
    hostId: 'system',
    name: 'Luxury Ocean View Hotel',
    description: 'Beautiful hotel with ocean views and premium amenities',
    location: {
      address: '123 Beach Road',
      city: 'Miami',
      coordinates: { lat: 25.7617, lng: -80.1918 },
    },
    amenities: ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant'],
    price: 150,
    basePrice: 150,
    rating: 4.5,
    reviewCount: 120,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    ],
    availability: [],
  });

  await lodgingService.createLodging({
    hostId: 'system',
    name: 'Mountain Retreat Lodge',
    description: 'Cozy lodge in the mountains with stunning views',
    location: {
      address: '456 Mountain Pass',
      city: 'Denver',
      coordinates: { lat: 39.7392, lng: -104.9903 },
    },
    amenities: ['Fireplace', 'Hiking Trail', 'Kitchen', 'Telescope'],
    price: 120,
    basePrice: 120,
    rating: 4.7,
    reviewCount: 85,
    images: [
      'https://images.unsplash.com/photo-1520763185298-1b434c919abe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    ],
    availability: [],
  });

  await lodgingService.createLodging({
    hostId: 'system',
    name: 'Downtown City Apartment',
    description: 'Modern apartment in the heart of the city',
    location: {
      address: '789 Main Street',
      city: 'New York',
      coordinates: { lat: 40.7128, lng: -74.006 },
    },
    amenities: ['WiFi', 'Laundry', 'Kitchen', 'Doorman', 'Gym'],
    price: 200,
    basePrice: 200,
    rating: 4.3,
    reviewCount: 200,
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1540932239986-310128078ceb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1445457519022-0d2d4d0f6995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    ],
    availability: [],
  });

  await lodgingService.createLodging({
    hostId: 'system',
    name: 'Beach Paradise Resort',
    description: 'Tropical resort with white sand beach and crystal clear water',
    location: {
      address: '100 Coconut Lane',
      city: 'Cancun',
      coordinates: { lat: 21.1619, lng: -86.8515 },
    },
    amenities: ['Beach Access', 'Pool', 'Spa', 'Bar', 'Restaurant', 'Water Sports'],
    price: 180,
    basePrice: 180,
    rating: 4.8,
    reviewCount: 250,
    images: [
      'https://images.unsplash.com/photo-1571896367050-0aee10cc2e38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    ],
    availability: [],
  });

  await lodgingService.createLodging({
    hostId: 'system',
    name: 'Historic Boutique Hotel',
    description: 'Charming historic hotel with vintage architecture and modern comfort',
    location: {
      address: '234 Heritage Street',
      city: 'Boston',
      coordinates: { lat: 42.3601, lng: -71.0589 },
    },
    amenities: ['WiFi', 'Restaurant', 'Bar', 'Concierge', 'Library'],
    price: 160,
    basePrice: 160,
    rating: 4.6,
    reviewCount: 180,
    images: [
      'https://images.unsplash.com/photo-1542314503-37143f4f1491?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1508692026619-51raindrops-unsplash?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    ],
    availability: [],
  });

  await lodgingService.createLodging({
    hostId: 'system',
    name: 'Modern Business Hotel',
    description: 'Contemporary hotel perfect for business travelers with all amenities',
    location: {
      address: '567 Commerce Drive',
      city: 'San Francisco',
      coordinates: { lat: 37.7749, lng: -122.4194 },
    },
    amenities: ['WiFi', 'Business Center', 'Gym', 'Meeting Rooms', 'Restaurant', 'Bar'],
    price: 220,
    basePrice: 220,
    rating: 4.4,
    reviewCount: 320,
    images: [
      'https://images.unsplash.com/photo-1519167758993-c92de8d29bce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1578683800897-142befc1d591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522783988935-f5daeef8cf44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    ],
    availability: [],
  });

  await lodgingService.createLodging({
    hostId: 'system',
    name: 'Countryside Farm Stay',
    description: 'Peaceful farm stay with organic gardens and rural charm',
    location: {
      address: '890 Rural Route',
      city: 'Vermont',
      coordinates: { lat: 44.0459, lng: -72.7107 },
    },
    amenities: ['Farm Tour', 'Organic Meals', 'Hiking', 'Pond', 'Library'],
    price: 95,
    basePrice: 95,
    rating: 4.7,
    reviewCount: 95,
    images: [
      'https://images.unsplash.com/photo-1500382017468-7049fae59211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1511308828496-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    ],
    availability: [],
  });

  await lodgingService.createLodging({
    hostId: 'system',
    name: 'Luxury Penthouse Suite',
    description: 'Spectacular penthouse with panoramic city views and modern luxury',
    location: {
      address: '1000 Skyline Drive',
      city: 'Los Angeles',
      coordinates: { lat: 34.0522, lng: -118.2437 },
    },
    amenities: ['Rooftop Terrace', 'Concierge', 'Spa', 'Chef', 'Wine Cellar'],
    price: 500,
    basePrice: 500,
    rating: 4.9,
    reviewCount: 95,
    images: [
      'https://images.unsplash.com/photo-1512453575439-c461209b8601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1578683800897-142befc1d591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    ],
    availability: [],
  });

  await lodgingService.createLodging({
    hostId: 'system',
    name: 'Cozy Bed & Breakfast',
    description: 'Charming bed and breakfast with homemade breakfast and personal touch',
    location: {
      address: '234 Country Lane',
      city: 'Portland',
      coordinates: { lat: 45.5152, lng: -122.6784 },
    },
    amenities: ['Free Breakfast', 'Garden', 'Fireplace', 'WiFi', 'Library'],
    price: 85,
    basePrice: 85,
    rating: 4.5,
    reviewCount: 145,
    images: [
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1570129477492-45f003313e78?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    ],
    availability: [],
  });

  await lodgingService.createLodging({
    hostId: 'system',
    name: 'Lakefront Resort',
    description: 'Scenic lakefront resort with water sports and nature activities',
    location: {
      address: '567 Lakeshore Road',
      city: 'Lake Tahoe',
      coordinates: { lat: 39.0968, lng: -120.0324 },
    },
    amenities: ['Beach Access', 'Water Sports', 'Fishing', 'Hiking', 'Restaurant'],
    price: 175,
    basePrice: 175,
    rating: 4.6,
    reviewCount: 210,
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1496882521966-39f5cac13c19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    ],
    availability: [],
  });

  await lodgingService.createLodging({
    hostId: 'system',
    name: 'Luxury Desert Resort',
    description: 'Exclusive desert resort with championship golf course and spa',
    location: {
      address: '789 Palm Canyon Drive',
      city: 'Palm Springs',
      coordinates: { lat: 33.8302, lng: -116.5453 },
    },
    amenities: ['Golf Course', 'Spa', 'Pool', 'Restaurant', 'Tennis Court'],
    price: 350,
    basePrice: 350,
    rating: 4.7,
    reviewCount: 175,
    images: [
      'https://images.unsplash.com/photo-1551632786-fb3f14e9f8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1496417694712-202b81c8d8fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1571896367050-0aee10cc2e38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    ],
    availability: [],
  });

  await lodgingService.createLodging({
    hostId: 'system',
    name: 'Tropical Villa',
    description: 'Private villa with lush gardens and beachfront access',
    location: {
      address: '999 Island Paradise',
      city: 'Maui',
      coordinates: { lat: 20.7967, lng: -156.3319 },
    },
    amenities: ['Private Beach', 'Pool', 'Garden', 'Chef', 'Yoga Studio'],
    price: 450,
    basePrice: 450,
    rating: 4.8,
    reviewCount: 88,
    images: [
      'https://images.unsplash.com/photo-1570129477492-45f003313e78?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1537838369190-3872e1b53bdb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1571896367050-0aee10cc2e38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    ],
    availability: [],
  });

  await lodgingService.createLodging({
    hostId: 'system',
    name: 'Urban Loft',
    description: 'Trendy urban loft in artistic neighborhood with local vibe',
    location: {
      address: '456 Arts District',
      city: 'Austin',
      coordinates: { lat: 30.2672, lng: -97.7431 },
    },
    amenities: ['Rooftop Bar', 'Art Gallery', 'WiFi', 'Kitchen', 'Concierge'],
    price: 125,
    basePrice: 125,
    rating: 4.4,
    reviewCount: 230,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1540932239986-310128078ceb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1445457519022-0d2d4d0f6995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    ],
    availability: [],
  });

  await lodgingService.createLodging({
    hostId: 'system',
    name: 'Alpine Ski Chalet',
    description: 'Luxury ski chalet with fireplace, hot tub, and ski-in/ski-out access',
    location: {
      address: '111 Summit Ridge',
      city: 'Aspen',
      coordinates: { lat: 39.1911, lng: -106.8175 },
    },
    amenities: ['Ski-In/Out', 'Hot Tub', 'Fireplace', 'Sauna', 'Chef Kitchen'],
    price: 400,
    basePrice: 400,
    rating: 4.7,
    reviewCount: 156,
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1520763185298-1b434c919abe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    ],
    availability: [],
  });

    console.log('Database seeded successfully with images');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
