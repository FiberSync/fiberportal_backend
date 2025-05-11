const express = require('express');
const router = express.Router();

// Import the order controller
const orderController = require('../controllers/orders');

// Get All Orders
router.get('/', orderController.getAllOrders);

// Get Order by Batch Number
router.get('/batch', orderController.getOrderByBatchNumber);  // Query param: batchNumber

// Create a New Order
router.post('/', orderController.createOrder);

// Update an Order
router.put('/', orderController.updateOrder);  // Query param: batchNumber

// Delete an Order
router.delete('/', orderController.deleteOrder);  // Query param: batchNumber

// Add a Remark to an Order
router.post('/remarks', orderController.addRemarkToOrder);  // Query param: batchNumber

// Add Raw Materials to an Order
router.post('/raw-materials', orderController.addRawMaterialsToOrder);  // Query param: batchNumber

// Fetch Orders by Supplier
router.get('/supplier', orderController.getOrdersBySupplier);

// Query param: supplierName

router.get('/uploadScreenShot', orderController.createOrdersSnapshot);

module.exports = router;
