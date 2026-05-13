const express = require('express');
const router = express.Router();
const Creator = require('../models/Creator');
const mongoose = require('mongoose');

// GET all creators
router.get('/', async (req, res) => {
  try {
    const creators = await Creator.find().sort({ createdAt: -1 });
    res.json({ success: true, data: creators });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single creator by ID
router.get('/:id', async (req, res) => {
  try {
    const creator = await Creator.findOne({ creatorId: req.params.id });
    if (!creator) {
      return res.status(404).json({ success: false, message: 'Creator not found' });
    }
    res.json({ success: true, data: creator });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET creator by username
router.get('/username/:username', async (req, res) => {
  try {
    const creator = await Creator.findOne({ username: req.params.username });
    if (!creator) {
      return res.status(404).json({ success: false, message: 'Creator not found' });
    }
    res.json({ success: true, data: creator });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create new creator
router.post('/', async (req, res) => {
  try {
    console.log('=== FULL REQUEST BODY ===');
    console.log(JSON.stringify(req.body, null, 2));
    
    // Generate 5-character unique ID
    const generateCreatorId = () => {
      const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return `creator${result}`;
    };
    
    const creatorId = generateCreatorId();
    console.log(`Creating new creator with ID: ${creatorId}`);
    
    // Process incoming data
    let creatorData = {
      ...req.body,
      creatorId: creatorId
    };
    
    console.log('=== PROCESSED DATA BEFORE CONVERSION ===');
    console.log(JSON.stringify(creatorData, null, 2));
    
    // Convert string fields to appropriate types
    const numericFields = ['followers', 'avgViews', 'avgLikes', 'avgComments', 'originalPrice', 'companyPrice'];
    numericFields.forEach(field => {
      if (creatorData[field] !== undefined && creatorData[field] !== '') {
        const originalValue = creatorData[field];
        creatorData[field] = parseInt(creatorData[field]) || 0;
        console.log(`Converted ${field}: "${originalValue}" -> ${creatorData[field]}`);
      }
    });
    
    // Convert phone to string if needed
    if (creatorData.phone !== undefined && creatorData.phone !== '') {
      creatorData.phone = String(creatorData.phone);
      console.log(`Phone converted to: ${creatorData.phone}`);
    }
    
    // Convert languages from comma-separated string to array
    if (creatorData.languages && typeof creatorData.languages === 'string') {
      creatorData.languages = creatorData.languages.split(',').map(l => l.trim()).filter(l => l);
      console.log(`Languages converted to array:`, creatorData.languages);
    }
    
    // Ensure socialLinks is properly structured
    if (!creatorData.socialLinks || typeof creatorData.socialLinks !== 'object') {
      creatorData.socialLinks = {
        instagram: '',
        youtube: '',
        twitter: '',
        linkedin: '',
        facebook: ''
      };
      console.log('Created default socialLinks');
    }
    
    console.log('=== FINAL DATA BEFORE SAVE ===');
    console.log(JSON.stringify(creatorData, null, 2));
    
    // Check required fields
    if (!creatorData.name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }
    
    if (!creatorData.username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }
    
    if (!creatorData.socialLinks.instagram) {
      return res.status(400).json({
        success: false,
        message: 'Instagram URL is required'
      });
    }
    
    const creator = new Creator(creatorData);
    const savedCreator = await creator.save();
    
    res.status(201).json({ 
      success: true, 
      data: savedCreator,
      message: 'Creator created successfully'
    });
  } catch (error) {
    console.error('=== ERROR DETAILS ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username already exists'
      });
    }
    
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});
// PUT update creator
router.put('/:id', async (req, res) => {
  try {
    const updatedCreator = await Creator.findOneAndUpdate(
      { creatorId: req.params.id },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!updatedCreator) {
      return res.status(404).json({ success: false, message: 'Creator not found' });
    }
    res.json({ success: true, data: updatedCreator });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE creator
router.delete('/:id', async (req, res) => {
  try {
    const deletedCreator = await Creator.findOneAndDelete({ creatorId: req.params.id });
    if (!deletedCreator) {
      return res.status(404).json({ success: false, message: 'Creator not found' });
    }
    res.json({ success: true, message: 'Creator deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET creators by category
router.get('/category/:category', async (req, res) => {
  try {
    const creators = await Creator.find({ category: req.params.category });
    res.json({ success: true, data: creators });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET creators by location
router.get('/location/:location', async (req, res) => {
  try {
    const creators = await Creator.find({ location: req.params.location });
    res.json({ success: true, data: creators });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET available creators
router.get('/status/available', async (req, res) => {
  try {
    const creators = await Creator.find({ status: 'available' });
    res.json({ success: true, data: creators });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET creators with high views
router.get('/high-views/:min', async (req, res) => {
  try {
    const minViews = parseInt(req.params.min);
    const creators = await Creator.find({ avgViews: { $gte: minViews } });
    res.json({ success: true, data: creators });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET creators by price range
router.get('/price/:min/:max', async (req, res) => {
  try {
    const { min, max } = req.params;
    const creators = await Creator.find({
      companyPrice: { $gte: parseInt(min), $lte: parseInt(max) }
    });
    res.json({ success: true, data: creators });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET creators by engagement rate
router.get('/high-engagement/:min', async (req, res) => {
  try {
    const minEngagement = parseFloat(req.params.min);
    const creators = await Creator.find({
      engagement: { $regex: `^${minEngagement}`, $options: 'i' }
    });
    res.json({ success: true, data: creators });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;