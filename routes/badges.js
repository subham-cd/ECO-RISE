const express = require('express');
const Badge = require('../models/Badge');
const User = require('../models/User');
const QuestSubmission = require('../models/QuestSubmission');
const { auth, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/badges
// @desc    Get all badges
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { category, rarity, earned } = req.query;
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (rarity) {
      query.rarity = rarity;
    }

    const badges = await Badge.find(query)
      .populate('createdBy', 'name')
      .sort({ rarity: 1, createdAt: -1 });

    // If user wants to see only earned badges
    if (earned === 'true') {
      const user = await User.findById(req.user._id).populate('badges');
      const earnedBadgeIds = user.badges.map(badge => badge._id.toString());
      
      const earnedBadges = badges.filter(badge => 
        earnedBadgeIds.includes(badge._id.toString())
      );
      
      return res.json({
        success: true,
        data: { badges: earnedBadges }
      });
    }

    // Check which badges the user has earned
    const user = await User.findById(req.user._id).populate('badges');
    const earnedBadgeIds = user.badges.map(badge => badge._id.toString());

    const badgesWithStatus = badges.map(badge => ({
      ...badge.toObject(),
      earned: earnedBadgeIds.includes(badge._id.toString())
    }));

    res.json({
      success: true,
      data: { badges: badgesWithStatus }
    });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/badges
// @desc    Create a new badge (Admin only)
// @access  Private
router.post('/', auth, authorize('admin'), validate(schemas.createBadge), async (req, res) => {
  try {
    const badgeData = {
      ...req.body,
      createdBy: req.user._id
    };

    const badge = new Badge(badgeData);
    await badge.save();

    await badge.populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Badge created successfully',
      data: { badge }
    });
  } catch (error) {
    console.error('Create badge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/badges/check-eligibility
// @desc    Check badge eligibility for current user
// @access  Private
router.post('/check-eligibility', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('badges completedQuests');
    const earnedBadgeIds = user.badges.map(badge => badge._id.toString());
    
    // Get all badges user hasn't earned yet
    const availableBadges = await Badge.find({
      _id: { $nin: user.badges },
      isActive: true
    });

    const newlyEarnedBadges = [];

    for (const badge of availableBadges) {
      let eligible = false;

      switch (badge.criteria.type) {
        case 'quest_count':
          eligible = user.completedQuests.length >= badge.criteria.value;
          break;

        case 'karma_points':
          eligible = user.ecoKarmaPoints >= badge.criteria.value;
          break;

        case 'category_quests':
          const categoryQuests = await QuestSubmission.countDocuments({
            user: user._id,
            status: 'approved'
          }).populate({
            path: 'quest',
            match: { category: badge.criteria.category }
          });
          eligible = categoryQuests >= badge.criteria.value;
          break;

        case 'streak':
          // Implementation for streak logic would go here
          // This is a simplified version
          eligible = false;
          break;

        case 'special':
          // Special badges are awarded manually
          eligible = false;
          break;
      }

      if (eligible) {
        newlyEarnedBadges.push(badge);
        
        // Award the badge to the user
        await User.findByIdAndUpdate(user._id, {
          $push: { badges: badge._id }
        });
      }
    }

    res.json({
      success: true,
      data: {
        newlyEarnedBadges,
        message: newlyEarnedBadges.length > 0 
          ? `Congratulations! You earned ${newlyEarnedBadges.length} new badge(s)!`
          : 'No new badges earned at this time.'
      }
    });
  } catch (error) {
    console.error('Check badge eligibility error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PATCH /api/badges/:badgeId/award/:userId
// @desc    Award badge to user (Admin only)
// @access  Private
router.patch('/:badgeId/award/:userId', auth, authorize('admin'), async (req, res) => {
  try {
    const { badgeId, userId } = req.params;

    const badge = await Badge.findById(badgeId);
    if (!badge) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user already has this badge
    if (user.badges.includes(badgeId)) {
      return res.status(400).json({
        success: false,
        message: 'User already has this badge'
      });
    }

    // Award the badge
    await User.findByIdAndUpdate(userId, {
      $push: { badges: badgeId }
    });

    res.json({
      success: true,
      message: 'Badge awarded successfully',
      data: {
        badge,
        user: { _id: user._id, name: user.name }
      }
    });
  } catch (error) {
    console.error('Award badge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/badges/stats
// @desc    Get badge statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const totalBadges = await Badge.countDocuments({ isActive: true });
    
    const rarityStats = await Badge.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$rarity',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Badge.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get user's badge stats
    const user = await User.findById(req.user._id).populate('badges');
    const userBadgesByRarity = user.badges.reduce((acc, badge) => {
      acc[badge.rarity] = (acc[badge.rarity] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        totalBadges,
        userEarnedBadges: user.badges.length,
        completionPercentage: Math.round((user.badges.length / totalBadges) * 100),
        rarityBreakdown: rarityStats,
        categoryBreakdown: categoryStats,
        userBadgesByRarity
      }
    });
  } catch (error) {
    console.error('Get badge stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;