# EcoRise Backend API

A comprehensive Node.js + Express backend for the EcoRise environmental gamification platform.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Student, teacher, and admin roles with profile management
- **Quest System**: Create, submit, and verify eco-friendly challenges
- **Gamification**: Eco-karma points, badges, and avatar level progression
- **Leaderboards**: School and individual rankings
- **Ripple Map**: Geographic impact tracking and visualization
- **File Uploads**: Cloudinary integration for quest proof photos
- **Security**: Helmet, CORS, rate limiting, and input validation

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting
- **Environment**: dotenv

## 📦 Installation

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/ecorise
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

3. **Start MongoDB** (make sure MongoDB is running locally or use MongoDB Atlas)

4. **Seed the database**:
```bash
npm run seed
```

5. **Start the development server**:
```bash
npm run server
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "school": "school_id_here"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

### Quest Endpoints

#### Get All Quests
```http
GET /api/quests?category=planting&difficulty=easy&page=1&limit=10
Authorization: Bearer <jwt_token>
```

#### Submit Quest
```http
POST /api/quests/:id/submit
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

photo: <file>
textResponse: "Completed the quest successfully"
location: {
  "latitude": 19.0760,
  "longitude": 72.8777,
  "address": "Mumbai, India"
}
```

#### Verify Submission (Teacher/Admin)
```http
PATCH /api/quests/submissions/:id/verify
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "status": "approved",
  "reviewNotes": "Great work!"
}
```

### Leaderboard Endpoints

#### Get User Leaderboard
```http
GET /api/leaderboard/users?limit=50&school=school_id
Authorization: Bearer <jwt_token>
```

#### Get School Leaderboard
```http
GET /api/leaderboard/schools?limit=50
Authorization: Bearer <jwt_token>
```

### Badge Endpoints

#### Get All Badges
```http
GET /api/badges?category=planting&rarity=rare
Authorization: Bearer <jwt_token>
```

#### Check Badge Eligibility
```http
POST /api/badges/check-eligibility
Authorization: Bearer <jwt_token>
```

### Ripple Map Endpoints

#### Get Ripple Zones
```http
GET /api/ripple/zones?impactLevel=high&limit=50
Authorization: Bearer <jwt_token>
```

#### Get Nearby Zones
```http
GET /api/ripple/nearby?latitude=19.0760&longitude=72.8777&radius=50
Authorization: Bearer <jwt_token>
```

## 🗄️ Database Models

### User Schema
- Personal info (name, email, password)
- School association
- Eco-karma points and avatar level
- Badges and completed quests
- Role-based permissions

### Quest Schema
- Quest details and instructions
- Category and difficulty
- Eco-karma rewards
- Verification requirements

### School Schema
- School information and location
- Student and teacher associations
- Collective eco-karma points

### Badge Schema
- Badge metadata and requirements
- Rarity and category classification
- Automatic eligibility checking

### Ripple Zone Schema
- Geographic location data
- Environmental impact metrics
- Student and school participation

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Joi schema validation
- **CORS Protection**: Configurable cross-origin requests
- **Helmet Security**: Security headers and protection

## 🎮 Gamification System

### Eco-Karma Points
- Earned by completing verified quests
- Used for leaderboard rankings
- Triggers avatar level progression

### Avatar Levels
1. Seed (0-99 points)
2. Sprout (100-499 points)
3. Sapling (500-999 points)
4. Young Tree (1000-1499 points)
5. Growing Tree (1500-2499 points)
6. Mature Tree (2500-3499 points)
7. Ancient Tree (3500-4999 points)
8. Forest Guardian (5000-7499 points)
9. Eco Warrior (7500-9999 points)
10. Planet Protector (10000+ points)

### Badge System
- **Common**: Basic achievements
- **Rare**: Category-specific milestones
- **Epic**: Significant accomplishments
- **Legendary**: Exceptional achievements

## 🌍 Environmental Impact Tracking

The Ripple Map system tracks:
- Trees planted
- Plastic waste collected (kg)
- Water saved (liters)
- Energy saved (kWh)
- Carbon footprint reduced (kg CO2)

## 👥 User Roles

### Student
- Complete quests and earn rewards
- View leaderboards and badges
- Track personal progress

### Teacher
- Verify quest submissions
- View school statistics
- Manage student progress

### Admin
- Full system access
- Create quests and badges
- Manage schools and users
- System configuration

## 🚀 Deployment

### Environment Setup
```bash
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Production Start
```bash
npm start
```

## 🧪 Testing

The API includes comprehensive error handling and validation. Test with tools like Postman or curl.

### Sample Admin Credentials (after seeding)
- **Email**: admin@ecorise.com
- **Password**: admin123

## 📈 Performance Features

- **Database Indexing**: Optimized queries for leaderboards and searches
- **Pagination**: Efficient data loading for large datasets
- **Aggregation Pipelines**: Complex statistics and rankings
- **File Upload Optimization**: Cloudinary integration with image processing

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper validation for new endpoints
3. Include error handling
4. Update documentation for new features
5. Test thoroughly before deployment

## 📄 License

This project is part of the EcoRise environmental education platform.