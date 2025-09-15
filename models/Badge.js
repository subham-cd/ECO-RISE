const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Badge name is required'],
    trim: true,
    maxlength: [50, 'Badge name cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Badge description is required'],
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  icon: {
    type: String,
    required: [true, 'Badge icon is required'],
    default: '🏆'
  },
  category: {
    type: String,
    enum: ['planting', 'plastic', 'water', 'waste', 'knowledge', 'energy', 'transport', 'wildlife', 'general'],
    default: 'general'
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  requirement: {
    type: String,
    required: [true, 'Badge requirement is required']
  },
  criteria: {
    type: {
      type: String,
      enum: ['quest_count', 'karma_points', 'category_quests', 'streak', 'special'],
      required: true
    },
    value: {
      type: Number,
      required: function() {
        return this.criteria.type !== 'special';
      }
    },
    category: {
      type: String,
      required: function() {
        return this.criteria.type === 'category_quests';
      }
    }
  },
  color: {
    type: String,
    default: '#22c55e'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
badgeSchema.index({ category: 1, rarity: 1 });
badgeSchema.index({ isActive: 1 });

module.exports = mongoose.model('Badge', badgeSchema);