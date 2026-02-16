import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';

import { connectDB } from './config/database';
import authRoutes from './routes/auth';
import lodgingRoutes from './routes/lodgings';
import bookingRoutes from './routes/bookings';
import reviewRoutes from './routes/reviews';
import adminRoutes from './routes/admin';
import hostRoutes from './routes/host';
import paymentRoutes from './routes/payments';
import { errorHandler } from './middleware/auth';

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://frontend:3000',
  'http://backend:5000',
  'https://smart-ynwp.onrender.com',
  'https://smartlodging.vercel.app',
  process.env.FRONTEND_URL || ''
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(null, true); // Allow for now to debug
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/host', hostRoutes);
app.use('/api/lodgings', lodgingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'smart-lodging-backend' });
});

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
