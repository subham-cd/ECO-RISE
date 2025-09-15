const mongoose = require('mongoose');

const questSubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  quest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quest',
    required: [true, 'Quest is required']
  },
  photoProof: {
    url: String,
    publicId: String // Cloudinary public ID for deletion
  },
  textResponse: {
    type: String,
    maxlength: [1000, 'Response cannot exceed 1000 characters']
  },
  quizAnswers: [{
    question: String,
    answer: String,
    isCorrect: Boolean
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'needs_revision'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewNotes: {
    type: String,
    maxlength: [500, 'Review notes cannot exceed 500 characters']
  },
  reviewedAt: Date,
  submittedAt: {
    type: Date,
    default: Date.now
  },
  ecoKarmaAwarded: {
    type: Number,
    default: 0
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate submissions
questSubmissionSchema.index({ user: 1, quest: 1 }, { unique: true });

// Index for better query performance
questSubmissionSchema.index({ status: 1, submittedAt: -1 });
questSubmissionSchema.index({ user: 1, status: 1 });

// Pre-save middleware to update quest participant count
questSubmissionSchema.pre('save', async function(next) {
  if (this.isNew) {
    await mongoose.model('Quest').findByIdAndUpdate(
      this.quest,
      { $inc: { currentParticipants: 1 } }
    );
  }
  next();
});

module.exports = mongoose.model('QuestSubmission', questSubmissionSchema);