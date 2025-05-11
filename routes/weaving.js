const express = require('express');
const router = express.Router();
const weavingController = require('../controllers/weavingController');

// Create a new weaving record
router.post('/create', weavingController.createWeaving);

// Get all weaving records based on companyName and walletAddress
router.get('/getAll', weavingController.getAllWeavings);

// Update a weaving record by batch number
router.put('/update', weavingController.updateWeaving);

// Delete a weaving record by batch number
router.delete('/delete', weavingController.deleteWeaving);

module.exports = router;
