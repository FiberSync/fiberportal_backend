const express = require('express');
const router = express.Router();
const manufacturingController = require('../controllers/manufacturing');

// CREATE a new manufacturing record
router.post('/', manufacturingController.createManufacturingRecord);

// READ all manufacturing records (filtered by companyName or walletAddress)
router.get('/', manufacturingController.getAllManufacturingRecords);

// READ a single manufacturing record by ID
router.get('/details', manufacturingController.getManufacturingRecordById);

// UPDATE an existing manufacturing record
router.put('/', manufacturingController.updateManufacturingRecord);

// DELETE a manufacturing record
router.delete('/', manufacturingController.deleteManufacturingRecord);

// Additional feature: GET manufacturing records by company name
router.get('/company', manufacturingController.getManufacturingRecordsByCompany);

// GET a production summary (e.g., number of units produced per batch)
router.get('/summary', manufacturingController.getProductionSummary);

module.exports = router;
