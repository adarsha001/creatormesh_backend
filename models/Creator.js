const mongoose = require('mongoose');

const creatorSchema = new mongoose.Schema({
  creatorId: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    default: 'female'
  },
  description: String,
  languages: [String],
  location: String,
  category: String,
  followers: String,
  lvr: String,
  engagement: String,
  viewRatio: String,
  avgViews: String,
  avgLikes: String,
  avgComments: String,
  communityInfluenceScore: String,
  communityInsight: String,
  socialLinks: {
    instagram: { type: String, required: true },
    youtube: String,
    twitter: String,
    linkedin: String,
    facebook: String
  },
  originalPrice: String,
  companyPrice: String,
  email: String,
  phone: Number,
  response: String,
  strategicVerdict: String,
  status: {
    type: String,
    enum: ['available', 'busy', 'on_break'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// NO PRE-SAVE MIDDLEWARE - Remove it completely

const Creator = mongoose.model('Creator', creatorSchema);

module.exports = Creator;