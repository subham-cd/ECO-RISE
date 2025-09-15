const express = require('express');
const School = require('../models/School');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/schools
// @desc    Get all schools
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, location } = req.query;
    
    let query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const schools = await School.find(query)
      .select('name location ecoKarmaPoints students teachers establishedYear schoolType')
      .populate('students', 'name ecoKarmaPoints')
      .sort({ ecoKarmaPoints: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await School.countDocuments(query);

    // Add additional computed fields
    const schoolsWithStats = schools.map((school, index) => ({
      ...school.toObject(),
      rank: ((page - 1) * limit) + index + 1,
      totalStudents: school.students.length,
      averageKarmaPerStudent: school.students.length > 0 
        ? Math.round(school.ecoKarmaPoints / school.students.length) 
        : 0
    }));

    res.json({
      success: true,
      data: {
        schools: schoolsWithStats,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get schools error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/schools/:id
// @desc    Get school by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const school = await School.findById(req.params.id)
      .populate('students', 'name ecoKarmaPoints avatarLevel badges completedQuests')
      .populate('teachers', 'name email role');

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    // Calculate additional stats
    const stats = {
      totalStudents: school.students.length,
      totalTeachers: school.teachers.length,
      averageKarmaPerStudent: school.students.length > 0 
        ? Math.round(school.ecoKarmaPoints / school.students.length) 
        : 0,
      topStudents: school.students
        .sort((a, b) => b.ecoKarmaPoints - a.ecoKarmaPoints)
        .slice(0, 5),
      totalBadgesEarned: school.students.reduce((sum, student) => sum + student.badges.length, 0),
      totalQuestsCompleted: school.students.reduce((sum, student) => sum + student.completedQuests.length, 0)
    };

    res.json({
      success: true,
      data: {
        school: {
          ...school.toObject(),
          stats
        }
      }
    });
  } catch (error) {
    console.error('Get school error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/schools
// @desc    Create a new school (Admin only)
// @access  Private
router.post('/', auth, authorize('admin'), validate(schemas.createSchool), async (req, res) => {
  try {
    const school = new School(req.body);
    await school.save();

    res.status(201).json({
      success: true,
      message: 'School created successfully',
      data: { school }
    });
  } catch (error) {
    console.error('Create school error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PATCH /api/schools/:id
// @desc    Update school (Admin only)
// @access  Private
router.patch('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const school = await School.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    res.json({
      success: true,
      message: 'School updated successfully',
      data: { school }
    });
  } catch (error) {
    console.error('Update school error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/schools/:id/students
// @desc    Get school students
// @access  Private
router.get('/:id/students', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, sortBy = 'ecoKarmaPoints' } = req.query;
    
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    const sortOptions = {};
    sortOptions[sortBy] = -1;

    const students = await User.find({ 
      school: req.params.id, 
      isActive: true 
    })
      .select('name ecoKarmaPoints avatarLevel badges completedQuests createdAt')
      .populate('badges', 'name icon rarity')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments({ 
      school: req.params.id, 
      isActive: true 
    });

    // Add rank to each student
    const studentsWithRank = students.map((student, index) => ({
      ...student.toObject(),
      rank: ((page - 1) * limit) + index + 1
    }));

    res.json({
      success: true,
      data: {
        students: studentsWithRank,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get school students error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/schools/:id/stats
// @desc    Get detailed school statistics
// @access  Private
router.get('/:id/stats', auth, async (req, res) => {
  try {
    const school = await School.findById(req.params.id)
      .populate('students', 'ecoKarmaPoints badges completedQuests createdAt');

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    const students = school.students;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Calculate various statistics
    const stats = {
      totalStudents: students.length,
      totalEcoKarma: school.ecoKarmaPoints,
      averageKarmaPerStudent: students.length > 0 
        ? Math.round(school.ecoKarmaPoints / students.length) 
        : 0,
      
      // Badge statistics
      totalBadgesEarned: students.reduce((sum, student) => sum + student.badges.length, 0),
      averageBadgesPerStudent: students.length > 0 
        ? Math.round(students.reduce((sum, student) => sum + student.badges.length, 0) / students.length) 
        : 0,
      
      // Quest statistics
      totalQuestsCompleted: students.reduce((sum, student) => sum + student.completedQuests.length, 0),
      averageQuestsPerStudent: students.length > 0 
        ? Math.round(students.reduce((sum, student) => sum + student.completedQuests.length, 0) / students.length) 
        : 0,
      
      // Recent activity
      newStudentsThisMonth: students.filter(student => student.createdAt >= thirtyDaysAgo).length,
      
      // Top performers
      topStudents: students
        .sort((a, b) => b.ecoKarmaPoints - a.ecoKarmaPoints)
        .slice(0, 10)
        .map((student, index) => ({
          _id: student._id,
          name: student.name,
          ecoKarmaPoints: student.ecoKarmaPoints,
          badges: student.badges.length,
          completedQuests: student.completedQuests.length,
          rank: index + 1
        })),
      
      // Distribution by karma ranges
      karmaDistribution: {
        beginners: students.filter(s => s.ecoKarmaPoints < 100).length,
        intermediate: students.filter(s => s.ecoKarmaPoints >= 100 && s.ecoKarmaPoints < 500).length,
        advanced: students.filter(s => s.ecoKarmaPoints >= 500 && s.ecoKarmaPoints < 1000).length,
        experts: students.filter(s => s.ecoKarmaPoints >= 1000).length
      }
    };

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get school stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;