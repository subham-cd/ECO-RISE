const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: [true, 'School is required']
  },
  ecoKarmaPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  badges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge'
  }],
  completedQuests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quest'
  }],
  avatarLevel: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for avatar level name
userSchema.virtual('avatarLevelName').get(function() {
  const levels = [
    'Seed', 'Sprout', 'Sapling', 'Young Tree', 'Growing Tree',
    'Mature Tree', 'Ancient Tree', 'Forest Guardian', 'Eco Warrior', 'Planet Protector'
  ];
  return levels[this.avatarLevel - 1] || 'Eco Champion';
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Update avatar level based on eco karma points
userSchema.pre('save', function(next) {
  const points = this.ecoKarmaPoints;
  let newLevel = 1;
  
  if (points >= 10000) newLevel = 10;
  else if (points >= 7500) newLevel = 9;
  else if (points >= 5000) newLevel = 8;
  else if (points >= 3500) newLevel = 7;
  else if (points >= 2500) newLevel = 6;
  else if (points >= 1500) newLevel = 5;
  else if (points >= 1000) newLevel = 4;
  else if (points >= 500) newLevel = 3;
  else if (points >= 100) newLevel = 2;
  
  this.avatarLevel = newLevel;
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model('User', userSchema);