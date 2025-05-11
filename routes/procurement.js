const express = require('express');
const router = express.Router();
const {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    addProcurementAgentRemarks,
    addFieldAgentRemarks,
    updateShipmentDetails,
    updateStatus,
    getSupplierPerformance,
    getOrderCostData
} = require('../controllers/procurementOrders');

router.post('/addFieldAgentRemarks', addFieldAgentRemarks);

router.post('/addProUpdate', addProcurementAgentRemarks);

router.post('/updateShipmentDetails', updateShipmentDetails);

router.post('/updateStatus',updateStatus);

router.get('/getSupplierPerformance',getSupplierPerformance);

router.get('/getOrderCostData',getOrderCostData);

// Create a new order
router.post('/add', createOrder);

// Get all orders
router.get('/getAll', getAllOrders);

// Get a single order by ID
router.get('/get/:id', getOrderById);

// Update an order by ID
router.put('/update/:id', updateOrder);

// Delete an order by ID
router.delete('/delete/:id', deleteOrder);

// // Update order status (Procurement or Field Agent)
// router.put('/updateStatus/:id', updateOrderStatus);

module.exports = router;
