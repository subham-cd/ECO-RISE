const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

// Validation schemas
const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    school: Joi.string().required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50),
    email: Joi.string().email(),
    school: Joi.string()
  }),

  createQuest: Joi.object({
    title: Joi.string().min(5).max(100).required(),
    description: Joi.string().min(10).max(500).required(),
    category: Joi.string().valid('planting', 'plastic', 'water', 'waste', 'knowledge', 'energy', 'transport', 'wildlife').required(),
    ecoKarmaReward: Joi.number().min(10).max(1000).required(),
    verificationType: Joi.string().valid('photo', 'quiz', 'pledge', 'document').required(),
    difficulty: Joi.string().valid('easy', 'medium', 'hard'),
    estimatedTime: Joi.string(),
    instructions: Joi.array().items(Joi.object({
      step: Joi.number().required(),
      description: Joi.string().required()
    })),
    requirements: Joi.array().items(Joi.string()),
    tags: Joi.array().items(Joi.string()),
    icon: Joi.string(),
    validUntil: Joi.date(),
    maxParticipants: Joi.number().min(1)
  }),

  submitQuest: Joi.object({
    textResponse: Joi.string().max(1000),
    quizAnswers: Joi.array().items(Joi.object({
      question: Joi.string().required(),
      answer: Joi.string().required()
    })),
    location: Joi.object({
      latitude: Joi.number().min(-90).max(90),
      longitude: Joi.number().min(-180).max(180),
      address: Joi.string()
    })
  }),

  createBadge: Joi.object({
    name: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(10).max(200).required(),
    icon: Joi.string().required(),
    category: Joi.string().valid('planting', 'plastic', 'water', 'waste', 'knowledge', 'energy', 'transport', 'wildlife', 'general'),
    rarity: Joi.string().valid('common', 'rare', 'epic', 'legendary'),
    requirement: Joi.string().required(),
    criteria: Joi.object({
      type: Joi.string().valid('quest_count', 'karma_points', 'category_quests', 'streak', 'special').required(),
      value: Joi.number(),
      category: Joi.string()
    }).required(),
    color: Joi.string()
  }),

  createSchool: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    location: Joi.string().required(),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      pincode: Joi.string(),
      country: Joi.string()
    }),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90),
      longitude: Joi.number().min(-180).max(180)
    }),
    contactInfo: Joi.object({
      email: Joi.string().email(),
      phone: Joi.string(),
      website: Joi.string().uri()
    }),
    establishedYear: Joi.number().min(1800).max(new Date().getFullYear()),
    schoolType: Joi.string().valid('government', 'private', 'aided')
  }),

  updateRippleZone: Joi.object({
    zoneName: Joi.string().min(3).max(100),
    location: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
      address: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      country: Joi.string()
    }),
    ecoImpact: Joi.object({
      treesPlanted: Joi.number().min(0),
      plasticCollected: Joi.number().min(0),
      waterSaved: Joi.number().min(0),
      energySaved: Joi.number().min(0),
      carbonReduced: Joi.number().min(0)
    })
  })
};

module.exports = { validate, schemas };