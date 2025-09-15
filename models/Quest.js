const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quest title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Quest description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['planting', 'plastic', 'water', 'waste', 'knowledge', 'energy', 'transport', 'wildlife'],
    lowercase: true
  },
  ecoKarmaReward: {
    type: Number,
    required: [true, 'Eco karma reward is required'],
    min: [10, 'Minimum reward is 10 points'],
    max: [1000, 'Maximum reward is 1000 points']
  },
  verificationType: {
    type: String,
    required: [true, 'Verification type is required'],
    enum: ['photo', 'quiz', 'pledge', 'document'],
    default: 'photo'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  estimatedTime: {
    type: String, // e.g., "30 minutes", "1 day", "1 week"
    default: '1 hour'
  },
  instructions: [{
    step: Number,
    description: String
  }],
  requirements: [String],
  tags: [String],
  icon: {
    type: String,
    default: '🌱'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  validUntil: {
    type: Date
  },
  maxParticipants: {
    type: Number,
    default: null // null means unlimited
  },
  currentParticipants: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for quest status
questSchema.virtual('status').get(function() {
  if (!this.isActive) return 'inactive';
  if (this.validUntil && this.validUntil < new Date()) return 'expired';
  if (this.maxParticipants && this.currentParticipants >= this.maxParticipants) return 'full';
  return 'active';
});

// Index for better query performance
questSchema.index({ category: 1, isActive: 1 });
questSchema.index({ ecoKarmaReward: -1 });
questSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Quest', questSchema);