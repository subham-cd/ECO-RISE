# AI-Powered Smart Campus Features

This document outlines the AI and campus-centric enhancements added to the EcoRise platform.

## Overview

The application now includes real AI-powered task verification and Smart Campus intelligence features while maintaining the original design and user experience.

---

## 1. Task Completion Module

### Location
Integrated into the Ripple Map page (`/src/pages/RippleMap.tsx`)

### Components
- **TaskSubmission** (`/src/components/TaskSubmission.tsx`)
- **TaskCard** (`/src/components/TaskCard.tsx`)

### Features

#### Image Upload
- Students can upload proof images of campus actions
- Real-time image preview
- Support for common image formats (JPG, PNG, GIF, WebP)

#### Task Categories
- Waste Cleanup
- Water Conservation
- Infrastructure
- Traffic
- Safety

#### Submission Flow
1. User uploads an image
2. Provides description of action taken
3. Selects category
4. AI analysis runs automatically
5. Task is submitted for admin approval

---

## 2. AI Image Analysis Integration

### API Endpoint
```
POST /api/ai/analyze-image
```

### Request Format
```javascript
FormData {
  image: File
}
```

### Expected Response
```json
{
  "issueType": "Garbage Overflow",
  "severity": "High",
  "confidence": 0.92
}
```

### Implementation Status
- Placeholder API calls implemented
- Fallback to mock data when API unavailable
- Located in: `TaskSubmission.tsx` (lines 35-60)

### TODO
- Replace `/api/ai/analyze-image` with actual AI service URL
- Configure AI API key or backend service
- Recommended services:
  - Google Cloud Vision API
  - AWS Rekognition
  - Azure Computer Vision
  - Custom TensorFlow/PyTorch model

---

## 3. Backend Integration Points

### Task Submission
```
POST /api/tasks/submit
```

**Payload:**
```json
{
  "description": "Cleaned up plastic waste near library",
  "category": "Waste Cleanup",
  "imageUrl": "data:image/jpeg;base64,...",
  "aiAnalysisResult": {
    "issueType": "Garbage Overflow",
    "severity": "High",
    "confidence": 0.92
  },
  "status": "pending",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "userId": "user_id_here"
}
```

**TODO:**
- Implement backend endpoint for task storage
- Connect to database (Supabase recommended)
- Add user authentication
- Implement file upload to cloud storage (Cloudinary/S3)

### Status Update
```
PATCH /api/tasks/{taskId}/status
```

**Payload:**
```json
{
  "status": "approved" | "rejected" | "resolved"
}
```

**TODO:**
- Admin authentication required
- Role-based access control
- Implement status change notifications

---

## 4. Admin Approval Flow

### Task Status States
- **Pending**: Awaiting admin review
- **Approved**: Verified and accepted
- **Rejected**: Not meeting criteria
- **Resolved**: Issue has been addressed

### Admin Controls
Located in `TaskCard.tsx`

#### Buttons Available (Admin only)
- **Approve**: Validates submission and awards eco-karma points
- **Reject**: Marks submission as invalid
- **Mark Resolved**: Indicates issue has been fixed

### TODO
- Implement admin role management
- Add admin authentication middleware
- Create admin dashboard for bulk operations
- Add notification system for status changes

---

## 5. Smart Campus Intelligence Dashboard

### Component
`CampusIntelligence.tsx`

### API Endpoint
```
GET /api/ai/insights
```

### Expected Response
```json
{
  "wasteHotspots": [
    {
      "location": "Library Entrance",
      "severity": "High",
      "count": 12
    }
  ],
  "peakCrowdTimes": [
    {
      "time": "12:00 PM - 1:00 PM",
      "area": "Cafeteria",
      "level": "High"
    }
  ],
  "maintenanceAlerts": [
    {
      "type": "Water Leakage",
      "location": "Building A - 2nd Floor",
      "priority": "High"
    }
  ]
}
```

### Features
- AI-driven waste hotspot identification
- Peak crowd time predictions
- Maintenance alert system
- Real-time refresh capability

### TODO
- Connect to predictive analytics service
- Implement historical data analysis
- Add machine learning models for prediction
- Integrate IoT sensor data (optional)

---

## 6. Enhanced Ripple Map

### Severity-Based Color Coding

#### Color Scheme
- **Red**: High severity issues requiring immediate attention
- **Yellow**: Medium severity issues
- **Green**: Low severity or resolved issues

### Marker Tooltips
Enhanced to show:
- Issue type
- Severity level
- Current status
- Number of reports

### Implementation
Located in `RippleMap.tsx` (lines 81-96)

---

## 7. Gamified Score Update

### API Endpoint
```
PATCH /api/users/update-score
```

### Payload
```json
{
  "points": 100
}
```

### Trigger Events
- Task approved: +100 points
- Task resolved: Additional bonus points
- Special achievements unlocked

### TODO
- Implement backend scoring logic
- Add point calculation rules
- Create achievement system
- Update user profile in real-time
- Trigger badge eligibility checks

---

## Database Schema Recommendations

### Tasks Table
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  image_url TEXT,
  ai_issue_type VARCHAR(100),
  ai_severity VARCHAR(20),
  ai_confidence DECIMAL(3,2),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP
);
```

### Campus Insights Table
```sql
CREATE TABLE campus_insights (
  id UUID PRIMARY KEY,
  insight_type VARCHAR(50) NOT NULL,
  location VARCHAR(100),
  severity VARCHAR(20),
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Frontend State Management

### Current Implementation
- Local React state using `useState`
- Parent-child component communication via props

### Recommended Enhancements
- Add React Context for global task state
- Implement optimistic UI updates
- Add loading and error states
- Cache API responses

---

## Error Handling

### Current Implementation
All API calls include try-catch blocks with fallback to mock data.

### Production Recommendations
- Add user-friendly error messages
- Implement retry logic
- Log errors to monitoring service
- Add offline support

---

## Security Considerations

### Authentication
- All API endpoints should require JWT authentication
- Implement role-based access control (RBAC)
- Admin actions require elevated permissions

### Data Validation
- Validate image file types and sizes
- Sanitize user input
- Prevent SQL injection
- Rate limiting on API endpoints

### File Upload Security
- Scan uploaded images for malware
- Limit file sizes (recommended: 5MB max)
- Store files in secure cloud storage
- Generate secure URLs with expiration

---

## Performance Optimization

### Recommendations
1. **Image Optimization**
   - Compress images before upload
   - Generate thumbnails
   - Use CDN for serving images

2. **API Caching**
   - Cache AI insights for 5-10 minutes
   - Implement Redis for session management

3. **Lazy Loading**
   - Load task images on demand
   - Paginate task lists

---

## Testing Checklist

- [ ] Image upload functionality
- [ ] AI analysis mock responses
- [ ] Task submission flow
- [ ] Admin approval workflow
- [ ] Status update notifications
- [ ] Score update mechanism
- [ ] Campus intelligence dashboard refresh
- [ ] Responsive design on mobile
- [ ] Error handling scenarios
- [ ] Security validations

---

## Deployment Steps

1. **Environment Variables**
   ```env
   VITE_AI_API_URL=https://api.your-ai-service.com
   VITE_AI_API_KEY=your_api_key_here
   VITE_BACKEND_URL=https://api.ecorise.com
   ```

2. **Backend Setup**
   - Deploy task management endpoints
   - Configure database
   - Set up file storage
   - Enable CORS for frontend domain

3. **AI Service Integration**
   - Choose AI provider
   - Configure API credentials
   - Test image analysis pipeline
   - Set up webhook for async processing (optional)

4. **Frontend Deployment**
   - Build production bundle: `npm run build`
   - Deploy to hosting (Vercel/Netlify recommended)
   - Configure environment variables
   - Test all features in production

---

## Future Enhancements

### Phase 2 Features
- Real-time notifications using WebSockets
- Mobile app integration
- Geolocation-based task filtering
- Campus heatmap visualization
- Student leaderboard for task completion
- Automated task routing to campus staff
- Integration with campus management systems

### AI Enhancements
- Object detection for specific issue types
- Text extraction from images (OCR)
- Sentiment analysis of descriptions
- Predictive maintenance scheduling
- Anomaly detection in campus patterns

---

## Support and Documentation

### Code Comments
All TODO comments are marked in the code with:
- Required backend endpoints
- Authentication requirements
- Database integration points
- API configuration needs

### Component Locations
- Task Submission: `/src/components/TaskSubmission.tsx`
- Task Cards: `/src/components/TaskCard.tsx`
- Campus Intelligence: `/src/components/CampusIntelligence.tsx`
- Enhanced Ripple Map: `/src/pages/RippleMap.tsx`

### API Integration Files
Search for these patterns in the codebase:
- `TODO: Replace with actual AI endpoint URL`
- `TODO: Implement backend endpoint`
- `TODO: Admin authentication`
- `TODO: Implement scoring logic`
- `TODO: Connect to predictive analytics`

---

## Contact and Support

For implementation assistance:
1. Review inline code comments
2. Check this documentation
3. Test with mock data first
4. Implement backend endpoints progressively
5. Enable AI features last

Good luck with your Smart Campus implementation!
