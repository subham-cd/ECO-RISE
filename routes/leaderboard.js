const express = require('express');
const User = require('../models/User');
const School = require('../models/School');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/leaderboard/users
// @desc    Get top users globally
// @access  Private
router.get('/users', auth, async (req, res) => {
  try {
    const { limit = 50, school } = req.query;
    
    let query = { isActive: true };
    
    // Filter by school if specified
    if (school) {
      query.school = school;
    }

    const users = await User.find(query)
      .select('name ecoKarmaPoints avatarLevel school badges completedQuests')
      .populate('school', 'name location')
      .sort({ ecoKarmaPoints: -1 })
      .limit(parseInt(limit));

    // Add rank to each user
    const usersWithRank = users.map((user, index) => ({
      ...user.toObject(),
      rank: index + 1
    }));

    // Get current user's rank if not in top results
    let currentUserRank = null;
    if (!usersWithRank.find(u => u._id.toString() === req.user._id.toString())) {
      const currentUserPosition = await User.countDocuments({
        ...query,
        ecoKarmaPoints: { $gt: req.user.ecoKarmaPoints }
      });
      currentUserRank = currentUserPosition + 1;
    }

    res.json({
      success: true,
      data: {
        users: usersWithRank,
        currentUserRank,
        totalUsers: await User.countDocuments(query)
      }
    });
  } catch (error) {
    console.error('Get user leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/leaderboard/schools
// @desc    Get top schools globally
// @access  Private
router.get('/schools', auth, async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const schools = await School.find({ isActive: true })
      .select('name location ecoKarmaPoints students')
      .populate('students', 'name ecoKarmaPoints')
      .sort({ ecoKarmaPoints: -1 })
      .limit(parseInt(limit));

    // Add rank and additional stats to each school
    const schoolsWithRank = schools.map((school, index) => ({
      ...school.toObject(),
      rank: index + 1,
      totalStudents: school.students.length,
      averageKarmaPerStudent: school.students.length > 0 
        ? Math.round(school.ecoKarmaPoints / school.students.length) 
        : 0
    }));

    // Get current user's school rank
    let currentSchoolRank = null;
    const currentUserSchool = await School.findById(req.user.school);
    if (currentUserSchool) {
      const currentSchoolPosition = await School.countDocuments({
        isActive: true,
        ecoKarmaPoints: { $gt: currentUserSchool.ecoKarmaPoints }
      });
      currentSchoolRank = currentSchoolPosition + 1;
    }

    res.json({
      success: true,
      data: {
        schools: schoolsWithRank,
        currentSchoolRank,
        totalSchools: await School.countDocuments({ isActive: true })
      }
    });
  } catch (error) {
    console.error('Get school leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/leaderboard/categories
// @desc    Get leaderboard by quest categories
// @access  Private
router.get('/categories', auth, async (req, res) => {
  try {
    const { category, limit = 20 } = req.query;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }

    // Get users with most completed quests in specific category
    const pipeline = [
      {
        $lookup: {
          from: 'questsubmissions',
          localField: '_id',
          foreignField: 'user',
          as: 'submissions'
        }
      },
      {
        $lookup: {
          from: 'quests',
          localField: 'submissions.quest',
          foreignField: '_id',
          as: 'questDetails'
        }
      },
      {
        $addFields: {
          categoryQuests: {
            $filter: {
              input: '$questDetails',
              cond: { $eq: ['$$this.category', category] }
            }
          }
        }
      },
      {
        $addFields: {
          categoryQuestCount: { $size: '$categoryQuests' },
          categoryKarma: {
            $sum: '$categoryQuests.ecoKarmaReward'
          }
        }
      },
      {
        $match: {
          categoryQuestCount: { $gt: 0 },
          isActive: true
        }
      },
      {
        $lookup: {
          from: 'schools',
          localField: 'school',
          foreignField: '_id',
          as: 'school'
        }
      },
      {
        $unwind: '$school'
      },
      {
        $project: {
          name: 1,
          ecoKarmaPoints: 1,
          avatarLevel: 1,
          school: { name: 1, location: 1 },
          categoryQuestCount: 1,
          categoryKarma: 1
        }
      },
      {
        $sort: { categoryQuestCount: -1, categoryKarma: -1 }
      },
      {
        $limit: parseInt(limit)
      }
    ];

    const users = await User.aggregate(pipeline);

    // Add rank to each user
    const usersWithRank = users.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    res.json({
      success: true,
      data: {
        category,
        users: usersWithRank
      }
    });
  } catch (error) {
    console.error('Get category leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;