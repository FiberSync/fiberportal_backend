const express = require('express');
const router = express.Router();
const spinningController = require('../controllers/spinning');


router.post('/', spinningController.createSpinning);


router.get('/spinnings', spinningController.getAllSpinnings);  

// Get a single spinning record by ID
router.get('/spinnings/id', spinningController.getSpinningById);

// Update a spinning record by ID
router.put('/spinnings/update', spinningController.updateSpinning);

// Delete a spinning record by ID
router.delete('/spinnings/delete', spinningController.deleteSpinning);

module.exports = router;
