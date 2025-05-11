const express = require('express');
const router = express.Router();
const dyeingController = require('../controllers/dyeing'); // Adjust path

// Route to create a new dyeing record
router.post('/create', dyeingController.createDyeingRecord);

// Route to get all dyeing records (with query parameters for filtering)
router.get('/', dyeingController.getAllDyeingRecords);

// Route to get a single dyeing record by ID (using query parameter)
router.get('/record', dyeingController.getDyeingRecordById);

// Route to update an existing dyeing record (using query parameter for ID)
router.put('/update', dyeingController.updateDyeingRecord);

// Route to delete a dyeing record (using query parameter for ID)
router.delete('/delete', dyeingController.deleteDyeingRecord);

// Additional feature: Get all dyeing records by company (using query parameter)
router.get('/company', dyeingController.getDyeingRecordsByCompany);

// Route to get production summary (e.g., total dyed quantity and average production rate)
router.get('/production-summary', dyeingController.getProductionSummary);

module.exports = router;
