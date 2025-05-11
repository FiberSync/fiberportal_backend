const mongoose = require('mongoose');

// Main Order Schema for tracking textile orders
const orderSchema = new mongoose.Schema({
  batchNumber: { type: String, required: true, unique: true },
  productDescription: { type: String, required: true }, // Description of the product (e.g., Jeans, Shirts)
  quantity: { type: Number, required: true }, // Number of products in the batch
  orderStatus: {
    type: String,
    enum: ['Pending', 'Spinning', 'Weaving', 'Dyeing', 'Manufacturing', 'Finished', 'Delayed'],
    default: 'Pending',
  },
  remarks: [{
    department: { type: String, required: true }, // e.g., Spinning, Weaving, Dyeing, Manufacturing
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    updatedBy: { type: String, required: true }, // Who added the remark
  }], // Array of remarks from different stages
  rawMaterials: [{
    materialType: { type: String, required: true }, // e.g., Denim, Cotton
    materialGrade: { type: String, required: true }, // e.g., High Quality, Standard
    quantityUsed: { type: Number, required: true }, // Quantity of raw material used
    supplier: { type: String, required: true }, // Supplier Name for the raw material
    batchNumber: { type: String, required: true }, // Unique identifier for the batch
    purchasePrice: { type: Number, required: true }, // Cost of the raw material per unit
    deliveryDate: { type: Date, required: true }, // Date when the raw material was delivered
  }], // Raw material batches used for the order
  productionStartDate: { type: Date, default: Date.now }, // Date when production started
  productionEndDate: { type: Date }, // Date when production is expected to end or actually ended
  expectedDeliveryDate: { type: Date }, // Expected delivery date of the final product
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  companyName: { type: String, required: true }, // Associated company name
  walletAddress: { type: String, required: true }, // Wallet address for tracking payments or transactions
  products: [{
    productName: { type: String, required: true }, // Name of the product
    quantityUsed: { type: Number, required: true }, // Quantity of the product used
  }], // Link to inventory products
  supplier: { type: String, required: true }, // Supplier Name for the order (e.g., Fabric Innovations)
  totalOrderCost: { type: Number, required: true }, // Total cost of the order (production + raw material costs)
  batchType: { type: String, required: true }, // Batch type, such as 'Sample', 'Full Production', etc.
  specialInstructions: { type: String }, // Any special instructions for the order
  procurementAgent: { type: String }, // Procurement Agent Name
  fieldAgent: { type: String }, // Field Agent Name
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  fieldAgentStatus: {
    type: String,
    enum: ['Verified', 'Rejected', 'Delayed'],
    default: 'Verified',
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

