const mongoose = require('mongoose');

const creatorSchema = new mongoose.Schema({
  creatorId: {
    type: String,
    unique: true,
    sparse: true
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
  followers: Number,
  lvr: String,
  engagement: String,
  viewRatio: String,
  avgViews: Number,
  avgLikes: Number,
  avgComments: Number,
  communityInfluenceScore: String,
  communityInsight: String,
  socialLinks: {
    instagram: { type: String, required: true },
    youtube: String,
    twitter: String,
    linkedin: String,
    facebook: String
  },
  originalPrice: Number,
  companyPrice: Number,
  email: String,
  phone: String,
  response: String,
  strategicVerdict: String,
  status: {
    type: String,
    enum: ['available', 'busy', 'on_break'],
    default: 'available'
  }
}, {
  timestamps: true // This automatically handles createdAt and updatedAt
});

// NO pre-save middleware needed - timestamps handles everything

const Creator = mongoose.model('Creator', creatorSchema);

module.exports = Creator;