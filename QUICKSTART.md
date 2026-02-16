# Quick Start Guide

## 🚀 5-Minute Setup (Without Docker)

### Prerequisites
- Node.js 18+ ([download](https://nodejs.org))
- Python 3.9+ ([download](https://python.org))
- Git

### Step 1: Terminal 1 - Backend (Node.js)

```bash
cd backend
npm install
npm run dev
```

**Expected output**:
```
Server running on port 5000
Database seeded with sample data
```

✅ Backend ready at http://localhost:5000

### Step 2: Terminal 2 - ML Service (Python)

```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m src.main
```

**Expected output**:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

✅ ML Service ready at http://localhost:8000

### Step 3: Terminal 3 - Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

**Expected output**:
```
  VITE v5.0.0  ready in 234 ms

  ➜  Local:   http://localhost:3000
```

✅ Frontend ready at http://localhost:3000

---

## 🌱 Seeding the Database with Test Data

To populate the database with sample test accounts and lodgings:

```bash
cd backend
npm run seed
```

**What gets seeded**:

| Account | Email | Password | Role |
|---------|-------|----------|------|
| Admin | `admin@smartlodging.com` | `admin123` | System admin |
| Host | `host@smartlodging.com` | `host123` | Property manager |
| Client | `client@smartlodging.com` | `client123` | Booker/Guest |

Plus **14 sample lodgings** with images, pricing (K85-K500/night), and amenities.

**Expected output**:
```
✓ Admin user created: admin@smartlodging.com / admin123
✓ Host user created: host@smartlodging.com / host123
✓ Client user created: client@smartlodging.com / client123
✓ 14 sample lodgings created
✨ Database seed completed successfully!
```

> **Note**: The seed script is idempotent - running it multiple times won't create duplicates.

---

## 🧪 Testing the System

### 1. Test Backend (Terminal 1 - Backend)

```bash
# Check health
curl http://localhost:5000/health
# Expected: {"status":"ok","service":"smart-lodging-backend"}
```

### 2. Test ML Service (Terminal 2 - ML Service)

```bash
# Check health
curl http://localhost:8000/health
# Expected: {"status":"ok","service":"smart-lodging-ml-service"}
```

### 3. Test Complete Flow in Browser

Open http://localhost:3000

**Flow**:
1. Register → Enter name, email, password
2. Login → Use registered credentials
3. Browse Lodgings → Click "Search" to see sample lodgings
4. View Details → Click on any lodging card
5. Book → Select dates and book
6. Review → Leave a review (auto-analyzed for sentiment)
7. My Bookings → See your bookings

### 4. Test Admin & Host Dashboards

After seeding, log in with test accounts to access dashboards:

**Admin Dashboard** (log in as admin):
- Navigate to Admin panel
- View system stats (total users, lodgings)
- Manage users and delete listings

**Host Dashboard** (log in as host):
- Navigate to My Properties
- View your lodgings
- See bookings and revenue
- Manage (create/edit/delete) properties

### 5. API Testing with cURL

#### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Copy the `token` from response for authenticated requests.

#### Get Lodgings
```bash
curl -X GET "http://localhost:5000/api/lodgings?city=Miami&limit=5"
```

#### Get ML Recommendations
```bash
curl -X POST http://localhost:8000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_1",
    "limit": 10
  }'
```

#### Predict Price
```bash
curl -X POST http://localhost:8000/api/price-prediction \
  -H "Content-Type: application/json" \
  -d '{
    "lodging_id": "lodging_1",
    "check_in_date": "2024-03-15",
    "check_out_date": "2024-03-17",
    "seasonal_factor": 1.35
  }'
```

#### Analyze Sentiment
```bash
curl -X POST http://localhost:8000/api/sentiment \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Amazing hotel! The service was excellent and the rooms were spotless."
  }'
```

---

## 🐳 Docker Deployment (One Command)

### Prerequisites
- Docker
- Docker Compose

### Quick Start

```bash
# From root directory
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Services will be available at**:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- ML Service: http://localhost:8000
- PostgreSQL: localhost:5432

---

## 📚 Documentation

- [Full Setup Guide](SETUP.md) - Detailed configuration
- [API Documentation](API.md) - Complete endpoint reference
- [ML Models Guide](ML_MODELS.md) - Model architectures and metrics
- [Evaluation Guide](EVALUATION.md) - Testing and metrics

---

## 🎯 Key Features to Try

### 1. Personalized Recommendations
- Shows AI-powered recommendations based on user preferences
- Includes precision, recall, F1-score, and MAP metrics

### 2. Dynamic Price Prediction
- Predicts lodging prices based on dates and seasonal factors
- Shows confidence score and factor breakdown

### 3. Sentiment Analysis
- Automatically analyzes review sentiment (positive/neutral/negative)
- Displays confidence scores

### 4. User Authentication
- JWT-based secure login
- Profile management and preferences

### 5. Booking Management
- Check availability, create, and cancel bookings
- View booking history

---

## 🔧 Troubleshooting

### "Cannot find module" error
```bash
# Reinstall dependencies
npm install  # Frontend/Backend
pip install -r requirements.txt  # ML Service
```

### Port already in use
```bash
# Change ports in .env files
# Frontend: vite.config.ts
# Backend: .env PORT variable
# ML Service: .env PORT variable
```

### Database connection error
```bash
# Make sure PostgreSQL is running (if using it)
# Check .env DATABASE_URL is correct
```

### ML Service not responding
```bash
# Check Python packages
pip list | grep fastapi
# Reinstall if needed
pip install -r requirements.txt --force-reinstall
```

---

## 📊 Sample Data

The system comes with pre-seeded sample data:

**Lodgings**:
1. Luxury Ocean View Hotel (Miami) - $150/night
2. Mountain Retreat Lodge (Denver) - $120/night
3. Downtown City Apartment (New York) - $200/night

**Users**: Create your own via registration

**Reviews**: Create via the UI after booking

---

## 🛑 Stopping Services

### Terminal-based (Ctrl+C in each terminal)
```bash
# Backend terminal
Ctrl+C

# ML Service terminal
Ctrl+C

# Frontend terminal
Ctrl+C
```

### Docker
```bash
docker-compose down
```

---

## 📈 Next Steps

1. **Customize**: Modify lodgings, amenities, or business logic in `/backend/src/services`
2. **Enhance ML**: Add more training data in `ml-service/data/`
3. **Style**: Update UI with Tailwind CSS in `frontend/src/`
4. **Deploy**: Push to production using Docker images

---

## ❓ Common Questions

**Q: Can I use a different database?**
A: Yes! Currently uses in-memory storage. Add PostgreSQL connection in backend services.

**Q: How do I add more lodgings?**
A: Either:
- Use the admin endpoint `POST /api/lodgings`
- Add to sample data in `backend/src/services/index.ts`

**Q: Can I improve recommendation accuracy?**
A: Yes! Retrain models in `ml-service/src/models.py` with more user/booking data.

**Q: How do I export ML models?**
A: Models are in memory. To persist, add joblib serialization in model files.

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [FastAPI Tutorial](https://fastapi.tiangolo.com)
- [scikit-learn Docs](https://scikit-learn.org)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## 📞 Support

For issues:
1. Check logs in each terminal
2. Review error messages in browser console (F12)
3. Check `docs/` folder for detailed guides
4. Verify all services are running

---

**Ready to go!** 🎉

Start with the Frontend at http://localhost:3000
