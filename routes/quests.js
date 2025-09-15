const express = require('express');
const Quest = require('../models/Quest');
const QuestSubmission = require('../models/QuestSubmission');
const User = require('../models/User');
const School = require('../models/School');
const { auth, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { upload, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/quests
// @desc    Get all active quests
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { category, difficulty, page = 1, limit = 10, search } = req.query;
    
    const query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const quests = await Quest.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Quest.countDocuments(query);

    // Check which quests the user has already submitted
    const userSubmissions = await QuestSubmission.find({
      user: req.user._id,
      quest: { $in: quests.map(q => q._id) }
    }).select('quest status');

    const questsWithStatus = quests.map(quest => {
      const submission = userSubmissions.find(sub => 
        sub.quest.toString() === quest._id.toString()
      );
      
      return {
        ...quest.toObject(),
        userSubmission: submission ? {
          status: submission.status,
          hasSubmitted: true
        } : {
          hasSubmitted: false
        }
      };
    });

    res.json({
      success: true,
      data: {
        quests: questsWithStatus,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get quests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/quests/:id
// @desc    Get quest by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id)
      .populate('createdBy', 'name role');

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found'
      });
    }

    // Check if user has submitted this quest
    const userSubmission = await QuestSubmission.findOne({
      user: req.user._id,
      quest: quest._id
    });

    const questWithStatus = {
      ...quest.toObject(),
      userSubmission: userSubmission ? {
        status: userSubmission.status,
        hasSubmitted: true,
        submittedAt: userSubmission.submittedAt
      } : {
        hasSubmitted: false
      }
    };

    res.json({
      success: true,
      data: { quest: questWithStatus }
    });
  } catch (error) {
    console.error('Get quest error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/quests
// @desc    Create a new quest (Admin/Teacher only)
// @access  Private
router.post('/', auth, authorize('admin', 'teacher'), validate(schemas.createQuest), async (req, res) => {
  try {
    const questData = {
      ...req.body,
      createdBy: req.user._id
    };

    const quest = new Quest(questData);
    await quest.save();

    await quest.populate('createdBy', 'name role');

    res.status(201).json({
      success: true,
      message: 'Quest created successfully',
      data: { quest }
    });
  } catch (error) {
    console.error('Create quest error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/quests/:id/submit
// @desc    Submit quest proof
// @access  Private
router.post('/:id/submit', auth, upload.single('photo'), handleUploadError, validate(schemas.submitQuest), async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id);
    
    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found'
      });
    }

    if (!quest.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Quest is not active'
      });
    }

    // Check if quest has expired
    if (quest.validUntil && quest.validUntil < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Quest has expired'
      });
    }

    // Check if quest is full
    if (quest.maxParticipants && quest.currentParticipants >= quest.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Quest is full'
      });
    }

    // Check if user has already submitted this quest
    const existingSubmission = await QuestSubmission.findOne({
      user: req.user._id,
      quest: quest._id
    });

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted this quest'
      });
    }

    const submissionData = {
      user: req.user._id,
      quest: quest._id,
      ...req.body
    };

    // Handle photo upload
    if (req.file) {
      submissionData.photoProof = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    const submission = new QuestSubmission(submissionData);
    await submission.save();

    await submission.populate([
      { path: 'user', select: 'name email' },
      { path: 'quest', select: 'title category ecoKarmaReward' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Quest submitted successfully',
      data: { submission }
    });
  } catch (error) {
    console.error('Submit quest error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/quests/submissions/pending
// @desc    Get pending quest submissions (Teacher/Admin only)
// @access  Private
router.get('/submissions/pending', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const submissions = await QuestSubmission.find({ status: 'pending' })
      .populate('user', 'name email school')
      .populate('quest', 'title category ecoKarmaReward')
      .populate('user.school', 'name')
      .sort({ submittedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await QuestSubmission.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      data: {
        submissions,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get pending submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PATCH /api/quests/submissions/:id/verify
// @desc    Verify quest submission (Teacher/Admin only)
// @access  Private
router.patch('/submissions/:id/verify', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;

    if (!['approved', 'rejected', 'needs_revision'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const submission = await QuestSubmission.findById(req.params.id)
      .populate('user')
      .populate('quest');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    if (submission.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Submission has already been reviewed'
      });
    }

    submission.status = status;
    submission.reviewedBy = req.user._id;
    submission.reviewNotes = reviewNotes;
    submission.reviewedAt = new Date();

    if (status === 'approved') {
      submission.ecoKarmaAwarded = submission.quest.ecoKarmaReward;
      
      // Update user's eco karma and completed quests
      await User.findByIdAndUpdate(submission.user._id, {
        $inc: { ecoKarmaPoints: submission.quest.ecoKarmaReward },
        $push: { completedQuests: submission.quest._id }
      });

      // Update school's eco karma
      await School.findByIdAndUpdate(submission.user.school, {
        $inc: { ecoKarmaPoints: submission.quest.ecoKarmaReward }
      });
    }

    await submission.save();

    await submission.populate('reviewedBy', 'name');

    res.json({
      success: true,
      message: `Submission ${status} successfully`,
      data: { submission }
    });
  } catch (error) {
    console.error('Verify submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;