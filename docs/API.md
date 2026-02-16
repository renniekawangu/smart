# API Documentation

## Base URLs

- **Backend API**: `http://localhost:5000/api`
- **ML Service API**: `http://localhost:8000/api`

---

## Authentication

### JWT Token-Based Auth

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
**Endpoint**: `POST /auth/register`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_1",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_1",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User
**Endpoint**: `GET /auth/me`

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "user_1",
    "name": "John Doe",
    "email": "john@example.com",
    "preferences": {
      "budget": { "min": 50, "max": 300 },
      "location": "Miami",
      "amenities": ["WiFi", "Pool", "Gym"],
      "roomType": "Deluxe"
    }
  }
}
```

### Update User Profile
**Endpoint**: `PUT /auth/users/:userId`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "name": "John Updated",
  "preferences": {
    "budget": { "min": 100, "max": 400 },
    "location": "New York",
    "amenities": ["WiFi", "Gym", "Restaurant"],
    "roomType": "Suite"
  }
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "user_1",
    "name": "John Updated",
    "email": "john@example.com",
    "preferences": { ... }
  }
}
```

---

## Lodging Endpoints

### List Lodgings
**Endpoint**: `GET /lodgings`

**Query Parameters**:
- `city` (string): Filter by city
- `minPrice` (number): Minimum price per night
- `maxPrice` (number): Maximum price per night
- `amenities` (string): Comma-separated amenity names
- `limit` (number, default: 20): Results per page
- `offset` (number, default: 0): Pagination offset

**Example**:
```
GET /lodgings?city=Miami&minPrice=100&maxPrice=300&amenities=Pool,WiFi&limit=10
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "lodgings": [
      {
        "id": "lodging_1",
        "name": "Luxury Ocean View Hotel",
        "description": "Beautiful hotel with ocean views...",
        "location": {
          "address": "123 Beach Road",
          "city": "Miami",
          "coordinates": {
            "lat": 25.7617,
            "lng": -80.1918
          }
        },
        "amenities": ["WiFi", "Pool", "Gym", "Spa", "Restaurant"],
        "price": 150,
        "basePrice": 150,
        "rating": 4.5,
        "reviewCount": 120,
        "images": ["https://..."],
        "availability": [],
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 45
  }
}
```

### Get Lodging Details
**Endpoint**: `GET /lodgings/:id`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "lodging_1",
    "name": "Luxury Ocean View Hotel",
    ...
  }
}
```

### Create Lodging
**Endpoint**: `POST /lodgings`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "name": "New Resort",
  "description": "Luxury beach resort",
  "location": {
    "address": "456 Beach Ave",
    "city": "Miami",
    "coordinates": {
      "lat": 25.8,
      "lng": -80.2
    }
  },
  "amenities": ["WiFi", "Pool", "Restaurant"],
  "price": 200,
  "basePrice": 200,
  "images": ["https://..."]
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "lodging_101",
    ...
  }
}
```

### Search Lodgings
**Endpoint**: `GET /lodgings/search`

**Query Parameters**:
- `q` (string, required): Search query

**Example**:
```
GET /lodgings/search?q=ocean
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "lodging_1",
      "name": "Luxury Ocean View Hotel",
      ...
    },
    {
      "id": "lodging_5",
      "name": "Ocean Breeze Resort",
      ...
    }
  ]
}
```

---

## Booking Endpoints

### Create Booking
**Endpoint**: `POST /bookings`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "lodgingId": "lodging_1",
  "checkInDate": "2024-03-15",
  "checkOutDate": "2024-03-17",
  "numberOfGuests": 2
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "booking_1",
    "userId": "user_1",
    "lodgingId": "lodging_1",
    "checkInDate": "2024-03-15",
    "checkOutDate": "2024-03-17",
    "numberOfGuests": 2,
    "totalPrice": 300,
    "status": "pending",
    "createdAt": "2024-02-09T10:00:00Z"
  }
}
```

### Get Booking Details
**Endpoint**: `GET /bookings/:id`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "booking_1",
    ...
  }
}
```

### Get User Bookings
**Endpoint**: `GET /bookings/user/:userId`

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "booking_1",
      ...
    },
    {
      "id": "booking_2",
      ...
    }
  ]
}
```

### Check Availability
**Endpoint**: `POST /bookings/check-availability`

**Request Body**:
```json
{
  "lodgingId": "lodging_1",
  "checkInDate": "2024-03-15",
  "checkOutDate": "2024-03-17"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "available": true
  }
}
```

### Cancel Booking
**Endpoint**: `PATCH /bookings/:id/cancel`

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "booking_1",
    "status": "cancelled",
    ...
  }
}
```

---

## Review Endpoints

### Create Review
**Endpoint**: `POST /reviews`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "lodgingId": "lodging_1",
  "rating": 5,
  "comment": "Amazing hotel with excellent service and beautiful rooms!"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "review_1",
    "userId": "user_1",
    "lodgingId": "lodging_1",
    "rating": 5,
    "comment": "Amazing hotel with excellent service...",
    "sentiment": "positive",
    "sentimentScore": 0.92,
    "createdAt": "2024-02-09T10:00:00Z"
  }
}
```

### Get Review
**Endpoint**: `GET /reviews/:id`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "review_1",
    ...
  }
}
```

### Get Lodging Reviews
**Endpoint**: `GET /reviews/lodging/:lodgingId`

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "review_1",
      ...
    },
    {
      "id": "review_2",
      ...
    }
  ]
}
```

### Get User Reviews
**Endpoint**: `GET /reviews/user/:userId`

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "review_1",
      ...
    }
  ]
}
```

### Update Review
**Endpoint**: `PUT /reviews/:id`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "rating": 4,
  "comment": "Good stay, but could be better."
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "review_1",
    ...
  }
}
```

### Delete Review
**Endpoint**: `DELETE /reviews/:id`

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "Review deleted"
  }
}
```

---

## ML Service Endpoints

### Get Recommendations
**Endpoint**: `POST /api/recommendations`

**URL**: `http://localhost:8000/api/recommendations`

**Request Body**:
```json
{
  "user_id": "user_1",
  "limit": 10
}
```

**Response** (200):
```json
{
  "recommendations": [
    {
      "lodging_id": "lodging_1",
      "score": 0.95,
      "reason": "Matches your preference for luxury accommodations"
    },
    {
      "lodging_id": "lodging_5",
      "score": 0.89,
      "reason": "Popular with users who booked similar lodgings"
    }
  ],
  "evaluation_metrics": {
    "precision_at_k": 0.85,
    "recall_at_k": 0.78,
    "f1_score": 0.81,
    "map": 0.88
  }
}
```

### Predict Price
**Endpoint**: `POST /api/price-prediction`

**URL**: `http://localhost:8000/api/price-prediction`

**Request Body**:
```json
{
  "lodging_id": "lodging_1",
  "check_in_date": "2024-03-15",
  "check_out_date": "2024-03-17",
  "seasonal_factor": 1.35
}
```

**Response** (200):
```json
{
  "predicted_price": 185.50,
  "confidence": 0.92,
  "factors": {
    "base_price": 120.0,
    "seasonal_multiplier": 1.35,
    "demand_multiplier": 1.15
  }
}
```

### Analyze Sentiment
**Endpoint**: `POST /api/sentiment`

**URL**: `http://localhost:8000/api/sentiment`

**Request Body**:
```json
{
  "text": "Amazing hotel with excellent service and beautiful rooms!"
}
```

**Response** (200):
```json
{
  "sentiment": "positive",
  "confidence": 0.92,
  "score": 0.85
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "error": "Lodging not available for selected dates"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Rate Limiting

Currently not implemented. Plans for future:
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

---

## Pagination

For list endpoints, use `limit` and `offset`:

```
GET /lodgings?limit=20&offset=0   # First 20 items
GET /lodgings?limit=20&offset=20  # Next 20 items
```

---

## Common Examples

### Example: Complete Booking Flow

1. **List lodgings**
```bash
curl -X GET "http://localhost:5000/api/lodgings?city=Miami&maxPrice=300"
```

2. **Get lodging details and reviews**
```bash
curl -X GET "http://localhost:5000/api/lodgings/lodging_1"
curl -X GET "http://localhost:5000/api/reviews/lodging/lodging_1"
```

3. **Check availability**
```bash
curl -X POST "http://localhost:5000/api/bookings/check-availability" \
  -H "Content-Type: application/json" \
  -d '{
    "lodgingId": "lodging_1",
    "checkInDate": "2024-03-15",
    "checkOutDate": "2024-03-17"
  }'
```

4. **Create booking**
```bash
curl -X POST "http://localhost:5000/api/bookings" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "lodgingId": "lodging_1",
    "checkInDate": "2024-03-15",
    "checkOutDate": "2024-03-17",
    "numberOfGuests": 2
  }'
```

5. **Leave review**
```bash
curl -X POST "http://localhost:5000/api/reviews" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "lodgingId": "lodging_1",
    "rating": 5,
    "comment": "Amazing stay!"
  }'
```

---

**Last Updated**: February 2026
**Version**: 1.0.0
