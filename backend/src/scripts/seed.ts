import { connectDB } from '../config/database';
import { userService, lodgingService } from '../services/index';
import { hashPassword } from '../utils/password';
import 'dotenv/config';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');
    console.log('Connecting to MongoDB...');
    
    const connection = await connectDB();
    console.log('✓ Database connected');

    // Check if admin user exists
    console.log('Checking for admin user...');
    let adminUser = await userService.getUserByEmail('admin@smartlodging.com');
    if (adminUser) {
      console.log('✓ Admin user already exists');
    } else {
      const adminPasswordHash = await hashPassword('admin123');
      adminUser = await userService.createUser(
        'Admin User',
        'admin@smartlodging.com',
        adminPasswordHash
      );
      await userService.updateUser(adminUser.id, { role: 'admin' });
      console.log('✓ Admin user created: admin@smartlodging.com / admin123');
    }

    // Check if host user exists
    console.log('Checking for host user...');
    let hostUser = await userService.getUserByEmail('host@smartlodging.com');
    if (hostUser) {
      console.log('✓ Host user already exists');
    } else {
      const hostPasswordHash = await hashPassword('host123');
      hostUser = await userService.createUser(
        'Host User',
        'host@smartlodging.com',
        hostPasswordHash
      );
      await userService.updateUser(hostUser.id, { role: 'host' });
      console.log('✓ Host user created: host@smartlodging.com / host123');
    }

    // Check if client user exists
    console.log('Checking for client user...');
    let clientUser = await userService.getUserByEmail('client@smartlodging.com');
    if (clientUser) {
      console.log('✓ Client user already exists');
    } else {
      const clientPasswordHash = await hashPassword('client123');
      clientUser = await userService.createUser(
        'Client User',
        'client@smartlodging.com',
        clientPasswordHash
      );
      console.log('✓ Client user created: client@smartlodging.com / client123');
    }

    // Use host user ID for lodging associations or fallback to 'system'
    const hostId = hostUser?.id || 'system';

    // Check if sample lodgings exist
    console.log('Checking for existing lodgings...');
    const existingLodgings = await lodgingService.getAllLodgings();
    if (existingLodgings.total > 0) {
      console.log(`✓ Database already has ${existingLodgings.total} lodgings, skipping property seed`);
    } else {
      console.log('Seeding 14 sample lodgings...');
      
      // Create sample lodgings
      const lodgingsData = [
        {
          hostId,
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
        },
        {
          hostId,
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
        },
        {
          hostId,
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
        },
        {
          hostId,
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
        },
        {
          hostId,
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
        },
        {
          hostId,
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
        },
        {
          hostId,
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
        },
        {
          hostId,
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
        },
        {
          hostId,
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
        },
        {
          hostId,
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
        },
        {
          hostId,
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
        },
        {
          hostId,
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
        },
        {
          hostId,
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
        },
        {
          hostId,
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
        },
      ];

      let successCount = 0;
      for (const lodgingData of lodgingsData) {
        try {
          await lodgingService.createLodging(lodgingData);
          successCount++;
        } catch (error) {
          console.warn(`Failed to create lodging: ${lodgingData.name}`, error);
        }
      }
      console.log(`✓ ${successCount}/${lodgingsData.length} sample lodgings created`);
    }

    console.log('\n✨ Database seed completed successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('  Admin:  admin@smartlodging.com / admin123');
    console.log('  Host:   host@smartlodging.com / host123');
    console.log('  Client: client@smartlodging.com / client123');
    console.log('\n✓ You can now log in to the application with these test accounts');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedDatabase();
