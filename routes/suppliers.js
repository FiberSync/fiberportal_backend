const express = require('express');
const router = express.Router();
const {
    createSupplier,
    getAllSuppliers,
    deleteSupplier,
    updateSupplier,
} = require('../controllers/suppliers');

// Create a new supplier
router.post('/add', createSupplier);

// Get all suppliers
router.get('/getAll', getAllSuppliers);

// Delete a supplier by ID
router.delete('/delete/:id', deleteSupplier);

// Update a supplier by ID
router.put('/update/:id', updateSupplier);


module.exports = router;
