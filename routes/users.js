const express = require('express');
const User = require('../models/User');
const Badge = require('../models/Badge');
const QuestSubmission = require('../models/QuestSubmission');
const { auth, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('school', 'name location')
      .populate('badges', 'name icon rarity description')
      .populate('completedQuests', 'title category ecoKarmaReward');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user can view this profile (own profile or admin)
    if (req.user._id.toString() !== user._id.toString() && req.user.role !== 'admin') {
      // Return limited public info for other users
      const publicUser = {
        _id: user._id,
        name: user.name,
        school: user.school,
        ecoKarmaPoints: user.ecoKarmaPoints,
        avatarLevel: user.avatarLevel,
        avatarLevelName: user.avatarLevelName,
        badges: user.badges,
        completedQuests: user.completedQuests.length
      };
      
      return res.json({
        success: true,
        data: { user: publicUser }
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PATCH /api/users/:id
// @desc    Update user profile
// @access  Private
router.patch('/:id', auth, validate(schemas.updateProfile), async (req, res) => {
  try {
    // Check if user can update this profile
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own profile.'
      });
    }

    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
      .select('-password')
      .populate('school', 'name location');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/:id/badges
// @desc    Get user's badges
// @access  Private
router.get('/:id/badges', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('badges', 'name icon rarity description category createdAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { badges: user.badges }
    });
  } catch (error) {
    console.error('Get user badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/:id/submissions
// @desc    Get user's quest submissions
// @access  Private
router.get('/:id/submissions', auth, async (req, res) => {
  try {
    // Check if user can view submissions
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { status, page = 1, limit = 10 } = req.query;
    const query = { user: req.params.id };
    
    if (status) {
      query.status = status;
    }

    const submissions = await QuestSubmission.find(query)
      .populate('quest', 'title category ecoKarmaReward icon')
      .populate('reviewedBy', 'name')
      .sort({ submittedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await QuestSubmission.countDocuments(query);

    res.json({
      success: true,
      data: {
        submissions,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get user submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/:id/stats
// @desc    Get user's statistics
// @access  Private
router.get('/:id/stats', auth, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user can view stats
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get submission stats
    const submissionStats = await QuestSubmission.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get category stats
    const categoryStats = await QuestSubmission.aggregate([
      { $match: { user: user._id, status: 'approved' } },
      {
        $lookup: {
          from: 'quests',
          localField: 'quest',
          foreignField: '_id',
          as: 'questInfo'
        }
      },
      { $unwind: '$questInfo' },
      {
        $group: {
          _id: '$questInfo.category',
          count: { $sum: 1 },
          totalKarma: { $sum: '$ecoKarmaAwarded' }
        }
      }
    ]);

    const stats = {
      totalSubmissions: submissionStats.reduce((sum, stat) => sum + stat.count, 0),
      approvedSubmissions: submissionStats.find(s => s._id === 'approved')?.count || 0,
      pendingSubmissions: submissionStats.find(s => s._id === 'pending')?.count || 0,
      rejectedSubmissions: submissionStats.find(s => s._id === 'rejected')?.count || 0,
      totalBadges: user.badges.length,
      ecoKarmaPoints: user.ecoKarmaPoints,
      avatarLevel: user.avatarLevel,
      avatarLevelName: user.avatarLevelName,
      categoryBreakdown: categoryStats
    };

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;