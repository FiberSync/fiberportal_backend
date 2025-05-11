const ProcurementOrder = require('../models/procurementOrders');
const Invoice = require('../models/invoices');

// Create a new order
const createOrder = async (req, res) => {
  try {
    const info = {
      orderNumber: req.body.orderNumber,
      orderType: req.body.orderType,
      supplierName: req.body.supplierName,
      buyerName: req.body.buyerName,
      items: req.body.items,
      discount: req.body.discount || 0,
      totalCost: req.body.totalCost,
      status: req.body.status || 'Pending',
      fieldAgentName: req.body.fieldAgentName || '',
      shipmentDetails: req.body.shipmentDetails || {},
      procurementAgentUpdates: req.body.procurementAgentUpdates || [],
      fieldAgentUpdates: req.body.fieldAgentUpdates || [],
      additionalCosts: req.body.additionalCosts || [],
      companyName: req.body.companyName,
      walletAddress: req.body.walletAddress
    };

    const newOrder = new ProcurementOrder(info);
    const savedOrder = await newOrder.save();
    
    const order = await ProcurementOrder.findById(savedOrder._id);

    if (!order) {
      throw new Error('Order not found');
    }

    const invoiceNumber = `${order.orderNumber}-${Date.now()}`;
    const invoice = new Invoice({
      invoiceNumber: invoiceNumber,
      orderNumber: order.orderNumber,
      supplierName: order.supplierName,
      totalCost: order.totalCost,
      dueDate: order.shipmentDetails.expectedDeliveryDate,
    });

    await invoice.save();

    
    order.inoviceNumber = invoiceNumber;
    await order.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await ProcurementOrder.find({walletAddress: req.query.walletAddress,companyName: req.query.companyName});
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addProcurementAgentRemarks = async (req, res) => {
  try {
    const { orderNumber, agentName, status, remarks } = req.body;

    // Find the procurement order by order number
    const order = await ProcurementOrder.findOne({ orderNumber });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
      console.log("Its here")
    }

    // Create a new procurement agent update object
    const newUpdate = {
      agentName,
      status: status || 'Verified',  // Default status to 'Verified'
      remarks,
      date: new Date(),
    };

    // Add the new update to the procurementAgentUpdates array
    order.procurementAgentUpdates.push(newUpdate);

    // Save the updated order
    await order.save();

    res.status(200).json({
      message: "Procurement agent update added successfully",
      updatedOrder: order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const addFieldAgentRemarks = async (req, res) => {
  try {
    const { orderNumber, agentName, status, remarks } = req.body;

    // Find the procurement order by order number
    const order = await ProcurementOrder.findOne({ orderNumber });



    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Create a new field agent update object
    const newUpdate = {
      agentName,
      status: status || 'Checked',  // Default status to 'Checked'
      remarks,
      date: new Date(),
    };

    // Add the new update to the fieldAgentUpdates array
    order.fieldAgentUpdates.push(newUpdate);

    // Save the updated order
    await order.save();

    res.status(200).json({
      message: "Field agent update added successfully",
      updatedOrder: order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await ProcurementOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'ProcurementOrder not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an order by ID
const updateOrder = async (req, res) => {
  try {
    const order = await ProcurementOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'ProcurementOrder not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an order by ID
const deleteOrder = async (req, res) => {
  try {
    const order = await ProcurementOrder.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'ProcurementOrder not found' });
    }
    res.json({ message: 'ProcurementOrder deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (for procurement agent or field agent)
const updateOrderStatus = async (req, res) => {
  try {
    const { status, agentName, remarks, role } = req.body; // role = 'procurement' or 'field'

    const order = await ProcurementOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'ProcurementOrder not found' });
    }

    if (role === 'procurement') {
      order.procurementAgentUpdates.push({ agentName, status, remarks, date: new Date() });
    } else if (role === 'field') {
      order.fieldAgentUpdates.push({ agentName, status, remarks, date: new Date() });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    order.status = status; // Update overall order status
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateShipmentDetails = async (req, res) => {
  try {
    const { trackingNumber, expectedDeliveryDate, actualDeliveryDate, deliveryStatus } = req.body;

    const order = await ProcurementOrder.findOne({orderNumber: req.body.orderNumber});
    if (!order) {
      return res.status(404).json({ message: 'ProcurementOrder not found' });
    }
    order.shipmentDetails.trackingNumber = trackingNumber;
    order.shipmentDetails.expectedDeliveryDate = expectedDeliveryDate;
    order.shipmentDetails.actualDeliveryDate = actualDeliveryDate;
    order.shipmentDetails.deliveryStatus = deliveryStatus;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  }catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const updateStatus = async (req, res) => {
  try{
    const order = await ProcurementOrder.findOne({orderNumber: req.body.orderNumber});
    if (!order) {
      return res.status(404).json({ message: 'ProcurementOrder not found' });
    }
    order.status = req.body.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  }catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const getSupplierPerformance = async (req, res) => {
  try {
    const companyNameReq = req.query.companyName.trim();
    const walletAddress = req.query.walletAddress.trim();

    // Aggregate to get data for all suppliers
    const supplierPerformance = await ProcurementOrder.aggregate([
      {
        $match: {
          walletAddress: walletAddress,
          companyName: companyNameReq,
        },
      },
      {
        $group: {
          _id: "$supplierName", // Group by supplier name
          totalExpenditure: {
            $sum: { $subtract: ["$totalCost", "$discount"] }, // Apply discount to total cost
          },
          totalOrders: { $sum: 1 }, // Total number of orders
          totalAdditionalCosts: {
            $sum: { $sum: "$additionalCosts.cost" }, // Sum up all additional costs
          },
          approvedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "Approved"] }, 1, 0] }, // Count Approved Orders
          },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] }, // Count Pending Orders
          },
          processingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "Processing"] }, 1, 0] }, // Count Processing Orders
          },
          dispatchedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "Dispatched"] }, 1, 0] }, // Count Dispatched Orders
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0] }, // Count Delivered Orders
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] }, // Count Cancelled Orders
          },
          totalDeliveryTime: {
            $avg: {
              $cond: [
                { $eq: ["$status", "Delivered"] }, // Only consider delivered orders for delivery time
                { $subtract: ["$shipmentDetails.actualDeliveryDate", "$createdAt"] },
                0,
              ],
            },
          },
        },
      },
    ]);

    // Add total cost including additional costs and discounts
    const supplierDataWithTotalCosts = supplierPerformance.map((supplier) => {
      const totalCostIncludingExtras = supplier.totalExpenditure + supplier.totalAdditionalCosts;
      return { ...supplier, totalCostIncludingExtras };
    });

    // Calculate approval rate for non-disrupted performance
    const supplierDataWithApprovalRate = supplierDataWithTotalCosts.map((supplier) => {
      const nonDisruptedOrders = supplier.totalOrders - supplier.pendingOrders - supplier.cancelledOrders;
      const approvalRate = nonDisruptedOrders > 0 ? (nonDisruptedOrders / supplier.totalOrders) * 100 : 0; 
      return { ...supplier, approvalRate };
    });

    // Return data with added calculations
    res.json(supplierDataWithApprovalRate);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching supplier performance data");
  }
};


const getOrderCostData = async (req, res) => {
  try {
    const companyNameReq = req.query.companyName.trim();
    const walletAddress = req.query.walletAddress.trim();

    // Aggregate to get order cost data
    const orderCostData = await ProcurementOrder.aggregate([
      {
        $match: {
          walletAddress: walletAddress,
          companyName: companyNameReq,
        },
      },
      {
        $group: {
          _id: "$orderType", // Group by order type
          totalCost: {
            $sum: { $subtract: ["$totalCost", "$discount"] }, // Apply discount to total cost
          },
          totalAdditionalCosts: {
            $sum: { $sum: { $ifNull: ["$additionalCosts.cost", 0] } }, // Safely sum additional costs if it's present
          },
          totalOrders: { $sum: 1 }, // Total number of orders
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] }, // Count Pending Orders
          },
          approvedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "Approved"] }, 1, 0] }, // Count Approved Orders
          },
          processingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "Processing"] }, 1, 0] }, // Count Processing Orders
          },
          dispatchedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "Dispatched"] }, 1, 0] }, // Count Dispatched Orders
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0] }, // Count Delivered Orders
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] }, // Count Cancelled Orders
          },
        },
      },
    ]);

    // Add total cost including additional costs and discounts
    const orderDataWithTotalCosts = orderCostData.map((order) => {
      const totalCostIncludingExtras = order.totalCost + order.totalAdditionalCosts;
      return { ...order, totalCostIncludingExtras };
    });

    // Prepare data for response
    const finalOrderData = orderDataWithTotalCosts.map((order) => {
      return {
        orderType: order._id,
        totalCost: order.totalCost,
        additionalCosts: order.totalAdditionalCosts,
        totalOrders: order.totalOrders,
        orderStatuses: {
          pending: order.pendingOrders,
          approved: order.approvedOrders,
          processing: order.processingOrders,
          dispatched: order.dispatchedOrders,
          delivered: order.deliveredOrders,
          cancelled: order.cancelledOrders,
        },
        totalCostIncludingExtras: order.totalCostIncludingExtras,
      };
    });

    // Return the aggregated order data
    res.json(finalOrderData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching order cost data");
  }
};


module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  addFieldAgentRemarks,
  addProcurementAgentRemarks,
  updateShipmentDetails,
  updateStatus,
  getOrderCostData,
  getSupplierPerformance
};
