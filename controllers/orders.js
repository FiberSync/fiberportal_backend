const Order = require('../models/order');
const mongoose = require('mongoose');
const axios = require('axios');
const { parse } = require('json2csv'); 

// Controller Methods

// Get All Orders
exports.getAllOrders = async (req, res) => {
    const { companyName, walletAddress } = req.query;
    try {
        const orders = await Order.find({ walletAddress });
        res.status(200).json(orders);
        
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: 'Error fetching orders', error: err });
    }
};

// Get One Order by Batch Number
exports.getOrderByBatchNumber = async (req, res) => {
    const { batchNumber, companyName, walletAddress } = req.query;
    try {
        const order = await Order.findOne({ batchNumber, walletAddress });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (err) {
        console.error('Error fetching order:', err);
        res.status(500).json({ message: 'Error fetching order', error: err });
    }
};

// Create a New Order
exports.createOrder = async (req, res) => {
    const {
        batchNumber,
        productDescription,
        quantity,
        orderStatus,
        remarks,
        rawMaterials,
        productionStartDate,
        productionEndDate,
        expectedDeliveryDate,
        companyName,
        walletAddress,
        products,
        supplier,
        totalOrderCost,
        batchType,
        specialInstructions,
        procurementAgent,
        fieldAgent,
        status,
        fieldAgentStatus
    } = req.body;

    try {
        const newOrder = new Order({
            batchNumber,
            productDescription,
            quantity,
            orderStatus,
            remarks,
            rawMaterials,
            productionStartDate,
            productionEndDate,
            expectedDeliveryDate,
            companyName,
            walletAddress,
            products,
            supplier,
            totalOrderCost,
            batchType,
            specialInstructions,
            procurementAgent,
            fieldAgent,
            status: status || 'Pending',
            fieldAgentStatus: fieldAgentStatus || 'Verified'
        });

        const order = await newOrder.save();
        res.status(201).json(order);
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ message: 'Error creating order', error: err });
    }
};

// Update an Order
exports.updateOrder = async (req, res) => {
    const { batchNumber, companyName, walletAddress } = req.query;
    const {
        orderStatus,
        remarks,
        productionEndDate,
        expectedDeliveryDate,
        products,
        status,
        fieldAgentStatus,
        procurementAgent,
        fieldAgent,
        specialInstructions
    } = req.body;

    try {
        const order = await Order.findOne({ batchNumber, companyName, walletAddress });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update fields if they exist in the request
        if (orderStatus) order.orderStatus = orderStatus;
        if (remarks) order.remarks.push(...remarks);
        if (productionEndDate) order.productionEndDate = productionEndDate;
        if (expectedDeliveryDate) order.expectedDeliveryDate = expectedDeliveryDate;
        if (products) order.products = products;
        if (status) order.status = status;
        if (fieldAgentStatus) order.fieldAgentStatus = fieldAgentStatus;
        if (procurementAgent) order.procurementAgent = procurementAgent;
        if (fieldAgent) order.fieldAgent = fieldAgent;
        if (specialInstructions) order.specialInstructions = specialInstructions;

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (err) {
        console.error('Error updating order:', err);
        res.status(500).json({ message: 'Error updating order', error: err });
    }
};

// Delete an Order
exports.deleteOrder = async (req, res) => {
    const { batchNumber, companyName, walletAddress } = req.query;

    try {
        const order = await Order.findOneAndDelete({ batchNumber, companyName, walletAddress });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        console.error('Error deleting order:', err);
        res.status(500).json({ message: 'Error deleting order', error: err });
    }
};

// Add a Remark to an Order
exports.addRemarkToOrder = async (req, res) => {
    const { batchNumber, companyName, walletAddress } = req.query;
    const { department, message, updatedBy } = req.body;

    try {
        const order = await Order.findOne({ batchNumber, companyName, walletAddress });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const newRemark = { department, message, updatedBy };
        order.remarks.push(newRemark);

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (err) {
        console.error('Error adding remark to order:', err);
        res.status(500).json({ message: 'Error adding remark', error: err });
    }
};

// Add Raw Materials to an Order
exports.addRawMaterialsToOrder = async (req, res) => {
    const { batchNumber, companyName, walletAddress } = req.query;
    const { rawMaterialBatch } = req.body;

    try {
        const order = await Order.findOne({ batchNumber, companyName, walletAddress });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.rawMaterials.push(rawMaterialBatch);
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (err) {
        console.error('Error adding raw materials:', err);
        res.status(500).json({ message: 'Error adding raw materials', error: err });
    }
};

// Fetch Orders for a Specific Supplier
exports.getOrdersBySupplier = async (req, res) => {
    const { supplierName, companyName, walletAddress } = req.query;

    try {
        const orders = await Order.find({ supplier: supplierName, companyName, walletAddress });
        res.status(200).json(orders);
    } catch (err) {
        console.error('Error fetching orders for supplier:', err);
        res.status(500).json({ message: 'Error fetching orders', error: err });
    }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
    const { batchNumber, companyName, walletAddress } = req.query;
    const { status } = req.body;

    try {
        const order = await Order.findOne({ batchNumber, companyName, walletAddress });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (err) {
        console.error('Error updating order status:', err);
        res.status(500).json({ message: 'Error updating order status', error: err });
    }
};

// Update Field Agent Status
exports.updateFieldAgentStatus = async (req, res) => {
    const { batchNumber, companyName, walletAddress } = req.query;
    const { fieldAgentStatus } = req.body;

    try {
        const order = await Order.findOne({ batchNumber, companyName, walletAddress });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.fieldAgentStatus = fieldAgentStatus;
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (err) {
        console.error('Error updating field agent status:', err);
        res.status(500).json({ message: 'Error updating field agent status', error: err });
    }
};


const uploadToIPFS = async (csvData) => {
    try {
      const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
      const apiKey = '6e90b7f86426114fb7cb';
      const apiSecret = '3305e8c8e0d1014e1e1030da07856598d9d3eff822d1fe86389badce14d3cc9c';
  
      const headers = {
        'Content-Type': 'multipart/form-data',
        pinata_api_key: apiKey,
        pinata_secret_api_key: apiSecret,
      };
  
          const formData = new FormData();
          const blob = new Blob([csvData], { type: 'text/csv' }); // Blob for CSV content
          formData.append('file', blob, 'orders_snapshot.csv'); // Append the blob as a file // Append the CSV data as a file
  
      const response = await axios.post(url, formData, { headers });
  
      if (response.data.IpfsHash) {
        return response.data.IpfsHash;
      }
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      throw error; // Propagate the error
    }
  };
  
  // Endpoint to create snapshot and upload to IPFS as CSV
  exports.createOrdersSnapshot = async (req, res) => {
    const { walletAddress } = req.query;
  
    try {
      // Fetch all orders based on walletAddress
      const orders = await Order.find({ });
  
      // Convert the orders JSON to CSV format
      const csvData = parse(orders);  // json2csv will automatically map and convert
  
      // Convert the CSV string into a file buffer (to upload to IPFS)
      const fileBuffer = Buffer.from(csvData, 'utf-8');
  
      // Upload the CSV data to IPFS
      const ipfsHash = await uploadToIPFS(fileBuffer);
  
      // Respond with the IPFS CID (hash) URL
      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      res.status(200).json({ message: 'Snapshot uploaded to IPFS', ipfsUrl , ipfsHash: ipfsHash , walletAddress: walletAddress ,status:"success" ,type:"order"});
    } catch (err) {
      console.error('Error creating snapshot and uploading to IPFS:', err);
      res.status(500).json({ message: 'Error creating snapshot and uploading to IPFS', error: err });
    }
  };