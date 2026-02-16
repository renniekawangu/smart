# Smart Lodging - Intelligent Recommendation & Booking System

A full-stack, ML-powered lodging recommendation and booking platform featuring personalized recommendations, dynamic pricing predictions, and sentiment-aware insights.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│              TypeScript + Tailwind CSS + Vite               │
│         (Pages, Components, Services, Hooks, Types)         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Node.js/Express)                   │
│        TypeScript + JWT Auth + PostgreSQL (Future)          │
│   (Routes, Controllers, Services, Models, Middleware)       │
└────────────┬───────────────────────────────────────┬────────┘
             │                                       │
             │ HTTP/REST                      HTTP/REST
             ▼                                       ▼
┌──────────────────────────┐      ┌─────────────────────────────┐
│   PostgreSQL Database    │      │  ML Service (FastAPI)       │
│  (Users, Bookings, etc)  │      │  (Python ML Models)         │
└──────────────────────────┘      │  - Recommendations          │
                                  │  - Price Prediction         │
                                  │  - Sentiment Analysis       │
                                  └─────────────────────────────┘
```

## 📁 Project Structure

```
smart-lodging/
├── frontend/                       # React + TypeScript frontend
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Page components
│   │   ├── services/              # API client services
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── types/                 # TypeScript type definitions
│   │   ├── utils/                 # Utility functions
│   │   ├── App.tsx               # Main app component
│   │   └── main.tsx              # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── backend/                        # Node.js/Express backend
│   ├── src/
│   │   ├── routes/               # API routes
│   │   ├── controllers/          # Request handlers
│   │   ├── services/             # Business logic
│   │   ├── models/               # Data models
│   │   ├── middleware/           # Express middleware
│   │   ├── types/                # TypeScript interfaces
│   │   ├── utils/                # Helper functions
│   │   └── index.ts             # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── Dockerfile
│
├── ml-service/                    # Python FastAPI ML service
│   ├── src/
│   │   ├── routes/              # API endpoints
│   │   ├── services/            # Business logic
│   │   ├── models/              # ML models
│   │   ├── schemas.py          # Pydantic schemas
│   │   ├── utils/              # Metrics & helpers
│   │   └── main.py             # FastAPI app
│   ├── data/                   # Training data
│   ├── notebooks/              # Jupyter notebooks
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
│
├── docs/                        # Documentation
│   ├── API.md
│   ├── ML_MODELS.md
│   ├── SETUP.md
│   └── EVALUATION.md
│
├── docker-compose.yml
└── readme.md
```

## 🎯 Core Features

### 1. **User Management**
- User registration & login with JWT authentication
- User profile management
- Preference tracking (budget, location, amenities)

### 2. **Lodging Management**
- Create, read, update lodging listings
- Amenities, pricing, availability tracking
- Images and location metadata
- Filter and search capabilities

### 3. **Booking System**
- Availability checking
- Booking creation and management
- Cancellation handling
- Booking history tracking

### 4. **Review Management**
- Create, read, update reviews
- Sentiment analysis integration
- Rating tracking
- Review aggregation by lodging

### 5. **ML-Powered Features**

#### a) Personalized Recommendations
- **Hybrid Approach**: Collaborative + Content-Based Filtering
- Input: User profile, booking history, click behavior, ratings
- Output: Ranked list of recommended lodgings
- Metrics: Precision@K, Recall@K, F1-Score, MAP

#### b) Dynamic Price Prediction
- **Models**: Linear Regression, Random Forest, Time Series
- **Features**: Historical prices, seasonality, location, demand, events
- **Output**: Predicted price, confidence score, factor breakdown
- **Metrics**: RMSE, MAE, MAPE

#### c) Sentiment Analysis
- **Approach**: TF-IDF + Logistic Regression
- **Classification**: Positive, Neutral, Negative
- **Application**: Influence ranking, display sentiment scores
- **Metrics**: Accuracy, Confusion Matrix, Precision/Recall/F1 per class

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- Docker & Docker Compose (optional)
- PostgreSQL 13+ (or use Docker)

### Quick Start (Without Docker)

#### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
Server runs on `http://localhost:5000`

#### 2. ML Service Setup
```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m src.main
```
Service runs on `http://localhost:8000`

#### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```
Frontend runs on `http://localhost:3000`

### Docker Deployment

```bash
docker-compose up -d
```

Services:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- ML Service: http://localhost:8000
- PostgreSQL: localhost:5432

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/users/:userId` - Update user profile

### Lodging Endpoints
- `GET /api/lodgings` - List lodgings with filters
- `GET /api/lodgings/:id` - Get lodging details
- `POST /api/lodgings` - Create lodging
- `GET /api/lodgings/search` - Search lodgings

### Booking Endpoints
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `GET /api/bookings/user/:userId` - Get user bookings
- `POST /api/bookings/check-availability` - Check availability
- `PATCH /api/bookings/:id/cancel` - Cancel booking

### Review Endpoints
- `POST /api/reviews` - Create review (auto-sentiment analysis)
- `GET /api/reviews/:id` - Get review
- `GET /api/reviews/lodging/:lodgingId` - Get lodging reviews
- `GET /api/reviews/user/:userId` - Get user reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### ML Service Endpoints
- `POST /api/recommendations` - Get personalized recommendations
- `POST /api/price-prediction` - Predict price
- `POST /api/sentiment` - Analyze sentiment

## 🤖 ML Model Details

### Recommendation Engine
**File**: `ml-service/src/models.py`

```python
class RecommendationEngine:
    def get_recommendations(self, user_id: str, limit: int = 10):
        # Returns top-K recommendations with scores and reasons
        # Evaluation metrics: Precision, Recall, F1, MAP
```

**Evaluation Metrics**:
- Precision@K: Fraction of recommended items that are relevant
- Recall@K: Fraction of relevant items that are recommended
- F1-Score: Harmonic mean of precision and recall
- MAP (Mean Average Precision): Average precision at each relevant item

### Price Prediction Model
**File**: `ml-service/src/models.py`

```python
class PricePredictionModel:
    def predict(self, lodging_id, check_in, check_out, seasonal_factor):
        # Returns predicted price with confidence and factor breakdown
        # Metrics: RMSE, MAE, MAPE
```

**Features**:
- Base price
- Seasonal multiplier
- Demand multiplier
- Historical price trends

### Sentiment Analyzer
**File**: `ml-service/src/models.py`

```python
class SentimentAnalyzer:
    def analyze(self, text: str):
        # Returns sentiment label, score, and confidence
        # Training data: 24 sample reviews (8 positive, 8 negative, 8 neutral)
        # Classifier: Logistic Regression with TF-IDF features
```

**Output**:
```json
{
  "sentiment": "positive",
  "score": 0.85,
  "confidence": 0.92
}
```

## 📊 Evaluation Metrics

### Recommendation System
See `ml-service/src/utils/metrics.py`:
- Precision@10, Recall@10
- F1-Score
- Mean Average Precision (MAP)

### Price Prediction
- **RMSE** (Root Mean Squared Error): Penalizes large errors
- **MAE** (Mean Absolute Error): Average absolute prediction error
- **MAPE** (Mean Absolute Percentage Error): % error relative to actual price

### Sentiment Analysis
- **Accuracy**: Overall correctness
- **Confusion Matrix**: Per-class performance breakdown
- **Precision/Recall/F1**: Per-class metrics

## 🛡️ Security Features

- **JWT Authentication**: Token-based API security
- **Password Hashing**: bcryptjs with salt rounds
- **CORS**: Configurable cross-origin access
- **Helmet**: HTTP header security
- **Input Validation**: Express-validator on all inputs
- **Authorization**: User ownership checks on protected resources

## 📈 Scalability Considerations

### Frontend
- Code-splitting with Vite
- React Query for data caching
- Component memoization
- Lazy loading of pages

### Backend
- Service-oriented architecture
- In-memory caching (to be replaced with Redis)
- Connection pooling for database
- Horizontal scaling ready

### ML Service
- Model caching in memory
- Batch processing support
- Async request handling
- Containerized for scaling

## 🧪 Testing & Evaluation

### Sample Data Generation
```python
# In ml-service/src/utils/data_generation.py
from src.utils.data_generation import (
    generate_sample_reviews,
    generate_sample_user_ratings,
    generate_sample_prices
)
```

### Running Evaluations
```python
# Example: Evaluate recommendation metrics
from src.utils.metrics import RecommendationMetrics

precision = RecommendationMetrics.precision_at_k(relevant_items, recommended_items, k=10)
recall = RecommendationMetrics.recall_at_k(relevant_items, recommended_items, k=10)
f1 = RecommendationMetrics.f1_score(precision, recall)
```

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key
DATABASE_URL=postgresql://postgres:password@localhost:5432/smart_lodging
ML_SERVICE_URL=http://localhost:8000/api
BCRYPT_ROUNDS=10
```

### ML Service (.env)
```
PORT=8000
ENV=development
LOG_LEVEL=INFO
```

### Frontend (.env.local)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ML_SERVICE_URL=http://localhost:8000/api
```

## 🔄 Development Workflow

1. **Frontend Development**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Backend Development**
   ```bash
   cd backend
   npm run dev
   ```

3. **ML Service Development**
   ```bash
   cd ml-service
   python -m src.main
   ```

4. **Type Checking**
   ```bash
   npm run type-check  # For TS projects
   ```

5. **Linting**
   ```bash
   npm run lint
   ```

## 📦 Deployment

### Docker Compose (Recommended for Development)
```bash
docker-compose up -d
```

### Production Deployment
1. Update environment variables in `.env` files
2. Set `NODE_ENV=production`
3. Use a managed database (AWS RDS, Azure Database)
4. Deploy frontend to CDN (Vercel, Netlify)
5. Deploy backend & ML service to cloud (AWS ECS, Azure Container Instances, Heroku)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT

## 🎓 Key Technologies

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Query (@tanstack/react-query)
- React Router
- Axios

### Backend
- Node.js
- Express
- TypeScript
- JWT (jsonwebtoken)
- bcryptjs
- PostgreSQL (planned)

### ML Service
- Python 3.11
- FastAPI
- scikit-learn
- NLTK
- NumPy & Pandas
- Uvicorn

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify .env file has all required variables
- Check Node.js version (requires 18+)

### ML Service errors
- Ensure Python 3.9+ is installed
- Install all requirements: `pip install -r requirements.txt`
- Check if port 8000 is available

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check VITE_API_BASE_URL in .env.local
- Check CORS settings in backend

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Last Updated**: February 2026
**Version**: 1.0.0
