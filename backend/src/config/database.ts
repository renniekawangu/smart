import mongoose, { Connection } from 'mongoose';

let mongoConnection: Connection | null = null;

export const connectDB = async (): Promise<Connection> => {
  if (mongoConnection) {
    return mongoConnection;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://mongodb:27017/smart-lodging';

  console.log('MongoDB URI:', mongoUri.includes('mongodb+srv') ? 'Using MongoDB Atlas' : 'Using Local MongoDB');

  try {
    await mongoose.connect(mongoUri);
    mongoConnection = mongoose.connection;
    
    console.log('✓ MongoDB connected successfully');
    
    return mongoConnection;
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (mongoConnection) {
    await mongoose.disconnect();
    mongoConnection = null;
    console.log('✓ MongoDB disconnected');
  }
};

export const getConnection = (): Connection => {
  if (!mongoConnection) {
    throw new Error('Database not connected');
  }
  return mongoConnection;
};
