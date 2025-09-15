const express = require('express');
const RippleZone = require('../models/RippleZone');
const User = require('../models/User');
const School = require('../models/School');
const { auth, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/ripple/zones
// @desc    Get all ripple zones with eco impact
// @access  Private
router.get('/zones', auth, async (req, res) => {
  try {
    const { limit = 50, impactLevel } = req.query;
    
    let query = { isActive: true };
    
    if (impactLevel) {
      query.impactLevel = impactLevel;
    }

    const zones = await RippleZone.find(query)
      .populate('studentsInvolved', 'name ecoKarmaPoints')
      .populate('schoolsInvolved', 'name location')
      .sort({ totalImpactScore: -1 })
      .limit(parseInt(limit));

    // Add rank to each zone
    const zonesWithRank = zones.map((zone, index) => ({
      ...zone.toObject(),
      rank: index + 1
    }));

    res.json({
      success: true,
      data: {
        zones: zonesWithRank,
        totalZones: await RippleZone.countDocuments(query)
      }
    });
  } catch (error) {
    console.error('Get ripple zones error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/ripple/zones/:id
// @desc    Get specific ripple zone details
// @access  Private
router.get('/zones/:id', auth, async (req, res) => {
  try {
    const zone = await RippleZone.findById(req.params.id)
      .populate('studentsInvolved', 'name ecoKarmaPoints avatarLevel school')
      .populate('schoolsInvolved', 'name location ecoKarmaPoints')
      .populate('studentsInvolved.school', 'name');

    if (!zone) {
      return res.status(404).json({
        success: false,
        message: 'Ripple zone not found'
      });
    }

    res.json({
      success: true,
      data: { zone }
    });
  } catch (error) {
    console.error('Get ripple zone error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/ripple/zones
// @desc    Create or update ripple zone (Admin only)
// @access  Private
router.post('/zones', auth, authorize('admin'), validate(schemas.updateRippleZone), async (req, res) => {
  try {
    const { zoneName, location, ecoImpact } = req.body;

    // Check if zone already exists at this location
    const existingZone = await RippleZone.findOne({
      'location.latitude': location.latitude,
      'location.longitude': location.longitude
    });

    if (existingZone) {
      // Update existing zone
      Object.assign(existingZone.ecoImpact, ecoImpact);
      existingZone.lastUpdated = new Date();
      await existingZone.save();

      return res.json({
        success: true,
        message: 'Ripple zone updated successfully',
        data: { zone: existingZone }
      });
    }

    // Create new zone
    const zone = new RippleZone({
      zoneName,
      location,
      ecoImpact
    });

    await zone.save();

    res.status(201).json({
      success: true,
      message: 'Ripple zone created successfully',
      data: { zone }
    });
  } catch (error) {
    console.error('Create/update ripple zone error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PATCH /api/ripple/zones/:id/impact
// @desc    Update zone eco impact (Admin only)
// @access  Private
router.patch('/zones/:id/impact', auth, authorize('admin'), async (req, res) => {
  try {
    const { ecoImpact } = req.body;

    const zone = await RippleZone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({
        success: false,
        message: 'Ripple zone not found'
      });
    }

    // Update eco impact (increment values)
    Object.keys(ecoImpact).forEach(key => {
      if (zone.ecoImpact[key] !== undefined) {
        zone.ecoImpact[key] += ecoImpact[key] || 0;
      }
    });

    zone.lastUpdated = new Date();
    await zone.save();

    res.json({
      success: true,
      message: 'Zone impact updated successfully',
      data: { zone }
    });
  } catch (error) {
    console.error('Update zone impact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/ripple/zones/:id/join
// @desc    Add current user to ripple zone
// @access  Private
router.post('/zones/:id/join', auth, async (req, res) => {
  try {
    const zone = await RippleZone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({
        success: false,
        message: 'Ripple zone not found'
      });
    }

    // Check if user is already in the zone
    if (zone.studentsInvolved.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already part of this ripple zone'
      });
    }

    // Add user to zone
    zone.studentsInvolved.push(req.user._id);

    // Add user's school to zone if not already there
    if (!zone.schoolsInvolved.includes(req.user.school)) {
      zone.schoolsInvolved.push(req.user.school);
    }

    await zone.save();

    res.json({
      success: true,
      message: 'Successfully joined ripple zone',
      data: { zone }
    });
  } catch (error) {
    console.error('Join ripple zone error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/ripple/stats
// @desc    Get global ripple statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    // Aggregate global impact statistics
    const globalStats = await RippleZone.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalZones: { $sum: 1 },
          totalTreesPlanted: { $sum: '$ecoImpact.treesPlanted' },
          totalPlasticCollected: { $sum: '$ecoImpact.plasticCollected' },
          totalWaterSaved: { $sum: '$ecoImpact.waterSaved' },
          totalEnergySaved: { $sum: '$ecoImpact.energySaved' },
          totalCarbonReduced: { $sum: '$ecoImpact.carbonReduced' },
          totalStudents: { $sum: { $size: '$studentsInvolved' } },
          totalSchools: { $sum: { $size: '$schoolsInvolved' } }
        }
      }
    ]);

    // Get impact level distribution
    const impactLevelStats = await RippleZone.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$impactLevel',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get top performing zones
    const topZones = await RippleZone.find({ isActive: true })
      .sort({ totalImpactScore: -1 })
      .limit(5)
      .select('zoneName location.city ecoImpact totalImpactScore');

    const stats = globalStats[0] || {
      totalZones: 0,
      totalTreesPlanted: 0,
      totalPlasticCollected: 0,
      totalWaterSaved: 0,
      totalEnergySaved: 0,
      totalCarbonReduced: 0,
      totalStudents: 0,
      totalSchools: 0
    };

    res.json({
      success: true,
      data: {
        globalStats: stats,
        impactLevelDistribution: impactLevelStats,
        topPerformingZones: topZones
      }
    });
  } catch (error) {
    console.error('Get ripple stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/ripple/nearby
// @desc    Get nearby ripple zones based on coordinates
// @access  Private
router.get('/nearby', auth, async (req, res) => {
  try {
    const { latitude, longitude, radius = 50 } = req.query; // radius in km

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // Convert radius from km to radians (Earth radius = 6371 km)
    const radiusInRadians = radius / 6371;

    const nearbyZones = await RippleZone.find({
      isActive: true,
      'location.latitude': {
        $gte: latitude - radiusInRadians * (180 / Math.PI),
        $lte: latitude + radiusInRadians * (180 / Math.PI)
      },
      'location.longitude': {
        $gte: longitude - radiusInRadians * (180 / Math.PI) / Math.cos(latitude * Math.PI / 180),
        $lte: longitude + radiusInRadians * (180 / Math.PI) / Math.cos(latitude * Math.PI / 180)
      }
    })
      .populate('studentsInvolved', 'name')
      .populate('schoolsInvolved', 'name')
      .sort({ totalImpactScore: -1 });

    res.json({
      success: true,
      data: {
        zones: nearbyZones,
        searchRadius: radius,
        center: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) }
      }
    });
  } catch (error) {
    console.error('Get nearby zones error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;