const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const School = require('../models/School');
const Quest = require('../models/Quest');
const Badge = require('../models/Badge');
const RippleZone = require('../models/RippleZone');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecorise');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      School.deleteMany({}),
      Quest.deleteMany({}),
      Badge.deleteMany({}),
      RippleZone.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Create Schools
    const schools = await School.insertMany([
      {
        name: 'Green Valley High School',
        location: 'Mumbai, Maharashtra',
        address: {
          street: '123 Green Valley Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India'
        },
        coordinates: {
          latitude: 19.0760,
          longitude: 72.8777
        },
        contactInfo: {
          email: 'info@greenvalley.edu',
          phone: '+91-22-12345678',
          website: 'https://greenvalley.edu'
        },
        establishedYear: 1995,
        schoolType: 'private'
      },
      {
        name: 'Sunrise Academy',
        location: 'Delhi, Delhi',
        address: {
          street: '456 Sunrise Avenue',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001',
          country: 'India'
        },
        coordinates: {
          latitude: 28.6139,
          longitude: 77.2090
        },
        contactInfo: {
          email: 'contact@sunriseacademy.edu',
          phone: '+91-11-87654321'
        },
        establishedYear: 1988,
        schoolType: 'government'
      },
      {
        name: 'Nature\'s Way School',
        location: 'Bangalore, Karnataka',
        address: {
          street: '789 Nature Lane',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          country: 'India'
        },
        coordinates: {
          latitude: 12.9716,
          longitude: 77.5946
        },
        establishedYear: 2001,
        schoolType: 'aided'
      }
    ]);
    console.log('Created schools');

    // Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await User.create({
      name: 'EcoRise Admin',
      email: 'admin@ecorise.com',
      password: adminPassword,
      school: schools[0]._id,
      role: 'admin',
      ecoKarmaPoints: 10000,
      avatarLevel: 10
    });

    // Create Sample Users
    const sampleUsers = [];
    const userNames = [
      'Sarah Green', 'Arjun Patel', 'Priya Sharma', 'Rahul Kumar', 'Ananya Singh',
      'Vikram Reddy', 'Kavya Nair', 'Rohan Gupta', 'Sneha Joshi', 'Aditya Mehta'
    ];

    for (let i = 0; i < userNames.length; i++) {
      const hashedPassword = await bcrypt.hash('password123', 12);
      const user = {
        name: userNames[i],
        email: `user${i + 1}@example.com`,
        password: hashedPassword,
        school: schools[i % schools.length]._id,
        ecoKarmaPoints: Math.floor(Math.random() * 2000) + 100,
        role: i < 2 ? 'teacher' : 'student'
      };
      sampleUsers.push(user);
    }

    const users = await User.insertMany(sampleUsers);
    console.log('Created users');

    // Update schools with students
    for (const school of schools) {
      const schoolUsers = users.filter(user => user.school.toString() === school._id.toString());
      school.students = schoolUsers.filter(user => user.role === 'student').map(user => user._id);
      school.teachers = schoolUsers.filter(user => user.role === 'teacher').map(user => user._id);
      school.ecoKarmaPoints = schoolUsers.reduce((sum, user) => sum + user.ecoKarmaPoints, 0);
      await school.save();
    }

    // Create Quests
    const quests = await Quest.insertMany([
      {
        title: 'Plant a Tree Sapling',
        description: 'Plant a tree sapling in your neighborhood and upload a photo with location',
        category: 'planting',
        ecoKarmaReward: 100,
        verificationType: 'photo',
        difficulty: 'easy',
        estimatedTime: '1 hour',
        instructions: [
          { step: 1, description: 'Choose a suitable location for planting' },
          { step: 2, description: 'Dig a hole twice the width of the root ball' },
          { step: 3, description: 'Plant the sapling and water it' },
          { step: 4, description: 'Take a photo and upload with location' }
        ],
        requirements: ['Tree sapling', 'Gardening tools', 'Water'],
        tags: ['trees', 'planting', 'environment'],
        icon: '🌱',
        createdBy: adminUser._id
      },
      {
        title: 'Plastic Waste Collection',
        description: 'Collect 10 pieces of plastic waste from your surroundings',
        category: 'plastic',
        ecoKarmaReward: 80,
        verificationType: 'photo',
        difficulty: 'easy',
        estimatedTime: '30 minutes',
        instructions: [
          { step: 1, description: 'Gather collection materials (gloves, bag)' },
          { step: 2, description: 'Collect plastic waste from your area' },
          { step: 3, description: 'Sort and count the collected items' },
          { step: 4, description: 'Take a photo of collected waste' }
        ],
        requirements: ['Gloves', 'Collection bag'],
        tags: ['plastic', 'cleanup', 'waste'],
        icon: '🗑️',
        createdBy: adminUser._id
      },
      {
        title: 'Water Conservation Challenge',
        description: 'Save water for one full day and log your conservation efforts',
        category: 'water',
        ecoKarmaReward: 60,
        verificationType: 'pledge',
        difficulty: 'medium',
        estimatedTime: '1 day',
        instructions: [
          { step: 1, description: 'Track your daily water usage' },
          { step: 2, description: 'Implement water-saving techniques' },
          { step: 3, description: 'Log your conservation efforts' },
          { step: 4, description: 'Submit your daily report' }
        ],
        requirements: ['Water usage tracker', 'Conservation log'],
        tags: ['water', 'conservation', 'daily'],
        icon: '💧',
        createdBy: adminUser._id
      },
      {
        title: 'Energy Saving Week',
        description: 'Reduce your electricity consumption by 20% for one week',
        category: 'energy',
        ecoKarmaReward: 150,
        verificationType: 'document',
        difficulty: 'hard',
        estimatedTime: '1 week',
        instructions: [
          { step: 1, description: 'Record baseline energy consumption' },
          { step: 2, description: 'Implement energy-saving measures' },
          { step: 3, description: 'Monitor daily consumption' },
          { step: 4, description: 'Submit weekly comparison report' }
        ],
        requirements: ['Energy meter readings', 'Conservation log'],
        tags: ['energy', 'electricity', 'conservation'],
        icon: '⚡',
        createdBy: adminUser._id
      },
      {
        title: 'Wildlife Habitat Creation',
        description: 'Create a small habitat for local birds or insects',
        category: 'wildlife',
        ecoKarmaReward: 200,
        verificationType: 'photo',
        difficulty: 'hard',
        estimatedTime: '2 days',
        instructions: [
          { step: 1, description: 'Research local wildlife needs' },
          { step: 2, description: 'Gather materials for habitat' },
          { step: 3, description: 'Build the habitat structure' },
          { step: 4, description: 'Install and photograph the habitat' }
        ],
        requirements: ['Building materials', 'Research on local wildlife'],
        tags: ['wildlife', 'habitat', 'biodiversity'],
        icon: '🦋',
        createdBy: adminUser._id
      }
    ]);
    console.log('Created quests');

    // Create Badges
    const badges = await Badge.insertMany([
      {
        name: 'First Steps',
        description: 'Complete your first eco-quest',
        icon: '👶',
        category: 'general',
        rarity: 'common',
        requirement: 'Complete 1 quest',
        criteria: {
          type: 'quest_count',
          value: 1
        },
        color: '#22c55e',
        createdBy: adminUser._id
      },
      {
        name: 'Tree Hugger',
        description: 'Complete 5 planting quests',
        icon: '🌳',
        category: 'planting',
        rarity: 'rare',
        requirement: 'Complete 5 planting quests',
        criteria: {
          type: 'category_quests',
          value: 5,
          category: 'planting'
        },
        color: '#16a34a',
        createdBy: adminUser._id
      },
      {
        name: 'Plastic Warrior',
        description: 'Complete 10 plastic cleanup quests',
        icon: '♻️',
        category: 'plastic',
        rarity: 'epic',
        requirement: 'Complete 10 plastic cleanup quests',
        criteria: {
          type: 'category_quests',
          value: 10,
          category: 'plastic'
        },
        color: '#7c3aed',
        createdBy: adminUser._id
      },
      {
        name: 'Water Guardian',
        description: 'Complete 3 water conservation quests',
        icon: '💧',
        category: 'water',
        rarity: 'rare',
        requirement: 'Complete 3 water conservation quests',
        criteria: {
          type: 'category_quests',
          value: 3,
          category: 'water'
        },
        color: '#3b82f6',
        createdBy: adminUser._id
      },
      {
        name: 'Eco Champion',
        description: 'Earn 1000 eco-karma points',
        icon: '🏆',
        category: 'general',
        rarity: 'legendary',
        requirement: 'Earn 1000 eco-karma points',
        criteria: {
          type: 'karma_points',
          value: 1000
        },
        color: '#f59e0b',
        createdBy: adminUser._id
      },
      {
        name: 'Quest Master',
        description: 'Complete 25 quests',
        icon: '🎯',
        category: 'general',
        rarity: 'epic',
        requirement: 'Complete 25 quests',
        criteria: {
          type: 'quest_count',
          value: 25
        },
        color: '#8b5cf6',
        createdBy: adminUser._id
      }
    ]);
    console.log('Created badges');

    // Create Ripple Zones
    const rippleZones = await RippleZone.insertMany([
      {
        zoneName: 'Mumbai Green Initiative',
        location: {
          latitude: 19.0760,
          longitude: 72.8777,
          address: 'Mumbai, Maharashtra',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India'
        },
        ecoImpact: {
          treesPlanted: 1250,
          plasticCollected: 340,
          waterSaved: 8900,
          energySaved: 2500,
          carbonReduced: 1800
        },
        studentsInvolved: users.slice(0, 3).map(u => u._id),
        schoolsInvolved: [schools[0]._id],
        impactLevel: 'high'
      },
      {
        zoneName: 'Delhi Environmental Action',
        location: {
          latitude: 28.6139,
          longitude: 77.2090,
          address: 'Delhi, Delhi',
          city: 'Delhi',
          state: 'Delhi',
          country: 'India'
        },
        ecoImpact: {
          treesPlanted: 2100,
          plasticCollected: 560,
          waterSaved: 12500,
          energySaved: 3200,
          carbonReduced: 2400
        },
        studentsInvolved: users.slice(3, 6).map(u => u._id),
        schoolsInvolved: [schools[1]._id],
        impactLevel: 'very_high'
      },
      {
        zoneName: 'Bangalore Eco Warriors',
        location: {
          latitude: 12.9716,
          longitude: 77.5946,
          address: 'Bangalore, Karnataka',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India'
        },
        ecoImpact: {
          treesPlanted: 890,
          plasticCollected: 230,
          waterSaved: 6700,
          energySaved: 1800,
          carbonReduced: 1200
        },
        studentsInvolved: users.slice(6, 9).map(u => u._id),
        schoolsInvolved: [schools[2]._id],
        impactLevel: 'high'
      }
    ]);
    console.log('Created ripple zones');

    console.log('✅ Seed data created successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Schools: ${schools.length}`);
    console.log(`- Users: ${users.length + 1} (including admin)`);
    console.log(`- Quests: ${quests.length}`);
    console.log(`- Badges: ${badges.length}`);
    console.log(`- Ripple Zones: ${rippleZones.length}`);
    console.log('\n🔐 Admin Credentials:');
    console.log('Email: admin@ecorise.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seed function
seedData();