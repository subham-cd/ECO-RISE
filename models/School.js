const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'School name is required'],
    trim: true,
    maxlength: [100, 'School name cannot exceed 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  ecoKarmaPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  teachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  contactInfo: {
    email: String,
    phone: String,
    website: String
  },
  establishedYear: Number,
  schoolType: {
    type: String,
    enum: ['government', 'private', 'aided'],
    default: 'government'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total students count
schoolSchema.virtual('totalStudents').get(function() {
  return this.students.length;
});

// Virtual for school rank (will be calculated dynamically)
schoolSchema.virtual('rank').get(function() {
  return this._rank || 0;
});

// Index for better query performance
schoolSchema.index({ ecoKarmaPoints: -1 });
schoolSchema.index({ location: 1 });

module.exports = mongoose.model('School', schoolSchema);