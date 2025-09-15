const mongoose = require('mongoose');

const rippleZoneSchema = new mongoose.Schema({
  zoneName: {
    type: String,
    required: [true, 'Zone name is required'],
    trim: true,
    maxlength: [100, 'Zone name cannot exceed 100 characters']
  },
  location: {
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: -180,
      max: 180
    },
    address: String,
    city: String,
    state: String,
    country: { type: String, default: 'India' }
  },
  ecoImpact: {
    treesPlanted: {
      type: Number,
      default: 0,
      min: 0
    },
    plasticCollected: {
      type: Number, // in kg
      default: 0,
      min: 0
    },
    waterSaved: {
      type: Number, // in liters
      default: 0,
      min: 0
    },
    energySaved: {
      type: Number, // in kWh
      default: 0,
      min: 0
    },
    carbonReduced: {
      type: Number, // in kg CO2
      default: 0,
      min: 0
    }
  },
  studentsInvolved: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  schoolsInvolved: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School'
  }],
  impactLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'very_high'],
    default: 'low'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total impact score
rippleZoneSchema.virtual('totalImpactScore').get(function() {
  const { treesPlanted, plasticCollected, waterSaved, energySaved, carbonReduced } = this.ecoImpact;
  return (treesPlanted * 10) + (plasticCollected * 5) + (waterSaved * 0.1) + (energySaved * 2) + (carbonReduced * 3);
});

// Pre-save middleware to calculate impact level
rippleZoneSchema.pre('save', function(next) {
  const score = this.totalImpactScore;
  
  if (score >= 10000) this.impactLevel = 'very_high';
  else if (score >= 5000) this.impactLevel = 'high';
  else if (score >= 1000) this.impactLevel = 'medium';
  else this.impactLevel = 'low';
  
  this.lastUpdated = new Date();
  next();
});

// Index for geospatial queries
rippleZoneSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });
rippleZoneSchema.index({ impactLevel: 1, isActive: 1 });

module.exports = mongoose.model('RippleZone', rippleZoneSchema);