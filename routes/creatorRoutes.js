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

router.post('/', async (req, res) => {
  try {
    // Generate timestamp-based unique ID
    const generateCreatorId = () => {
      const timestamp = Date.now().toString(36); // Convert timestamp to base36
      const random = Math.random().toString(36).substring(2, 6); // Random 4 chars
      return `creator_${timestamp}_${random}`;
    };
    
    const creatorId = generateCreatorId();
    console.log(`Creating new creator with ID: ${creatorId}`);
    
    const creatorData = {
      ...req.body,
      creatorId: creatorId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Convert numeric fields
    const numericFields = ['followers', 'avgViews', 'avgLikes', 'avgComments', 'originalPrice', 'companyPrice'];
    numericFields.forEach(field => {
      if (creatorData[field]) {
        creatorData[field] = parseInt(creatorData[field]) || 0;
      }
    });
    
    const creator = new Creator(creatorData);
    const savedCreator = await creator.save();
    
    res.status(201).json({ 
      success: true, 
      data: savedCreator,
      message: 'Creator created successfully'
    });
  } catch (error) {
    console.error('Error in POST /api/creators:', error);
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
      req.body,
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

// GET creators with high views (above certain threshold)
router.get('/high-views/:min', async (req, res) => {
  try {
    const minViews = req.params.min;
    const creators = await Creator.find({
      $expr: {
        $gte: [
          { $toDouble: { $regexFind: { input: "$avgViews", regex: /\\d+/ } } },
          parseFloat(minViews)
        ]
      }
    });
    res.json({ success: true, data: creators });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET creators by price range (company price)
router.get('/price/:min/:max', async (req, res) => {
  try {
    const { min, max } = req.params;
    const creators = await Creator.find({
      $expr: {
        $and: [
          { $gte: [{ $toDouble: "$companyPrice" }, parseFloat(min)] },
          { $lte: [{ $toDouble: "$companyPrice" }, parseFloat(max)] }
        ]
      }
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
      $expr: {
        $gte: [
          { $toDouble: { $replaceAll: { input: "$engagement", find: "%", replacement: "" } } },
          minEngagement
        ]
      }
    });
    res.json({ success: true, data: creators });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;