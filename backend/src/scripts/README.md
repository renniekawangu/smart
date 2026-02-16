# Database Seeding

This directory contains the database seed script for populating the Smart Lodging application with initial data.

## Scripts

### `seed.ts`

The main database seeding script that initializes the database with:

1. **Test User Accounts**:
   - Admin: `admin@smartlodging.com` / `admin123`
   - Host: `host@smartlodging.com` / `host123`
   - Client: `client@smartlodging.com` / `client123`

2. **14 Sample Lodgings**:
   - Luxury properties across different cities
   - Complete with images, amenities, pricing, and ratings
   - All properties assigned to the host user

## Usage

### Development Mode
```bash
npm run seed
```

This uses `tsx` to run the TypeScript file directly, perfect for development.

### Production Mode (After Build)
```bash
npm run seed:prod
```

This runs the compiled JavaScript from the `dist/` directory.

## What Gets Seeded

### Users
The script creates 3 test users if they don't already exist:

| Email | Password | Role | Purpose |
|-------|----------|------|---------|
| admin@smartlodging.com | admin123 | admin | System administration, user management |
| host@smartlodging.com | host123 | host | Property management, booking oversight |
| client@smartlodging.com | client123 | client | Booking properties, leaving reviews |

### Lodgings
14 diverse properties including:
- Luxury Ocean View Hotel (Miami) - K150/night
- Mountain Retreat Lodge (Denver) - K120/night
- Downtown City Apartment (New York) - K200/night
- Beach Paradise Resort (Cancun) - K180/night
- Historic Boutique Hotel (Boston) - K160/night
- Modern Business Hotel (San Francisco) - K220/night
- Countryside Farm Stay (Vermont) - K95/night
- Luxury Penthouse Suite (Los Angeles) - K500/night
- Cozy Bed & Breakfast (Portland) - K85/night
- Lakefront Resort (Lake Tahoe) - K175/night
- Luxury Desert Resort (Palm Springs) - K350/night
- Tropical Villa (Maui) - K450/night
- Urban Loft (Austin) - K125/night
- Alpine Ski Chalet (Aspen) - K400/night

Each lodging includes:
- Description
- Location (address, city, coordinates)
- Amenities
- High-quality images (from Unsplash)
- Rating and review count
- Base and dynamic pricing

## Important Notes

- The seed script is **idempotent**: Running it multiple times won't create duplicates
- It checks if test users already exist before creating them
- It only seeds lodgings if the database is empty
- All lodgings are assigned to the host user created during seeding
- The script connects to MongoDB using the `MONGODB_URI` environment variable

## Environment Setup

Ensure your `.env` file has the correct MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/smart-lodging
# or for MongoDB Atlas:
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
```

## Docker Integration

The seed script is designed to work with both:
1. Local MongoDB instances
2. MongoDB running in Docker containers
3. MongoDB Atlas cloud database

When using Docker Compose, the MongoDB service must be running before executing the seed script.
