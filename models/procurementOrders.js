const mongoose = require("mongoose");

const procurementOrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true }, // Unique Order ID
    orderType: { 
      type: String, 
      enum: ['Raw Material', 'Production', 'Finished Goods'], 
      required: true 
    }, // Defines the type of order

    supplierName: { type: String, required: true }, // Supplier name instead of reference
    buyerName: { type: String, required: true }, // Buyer company name instead of reference

    items: [
      {
        productName: { type: String, required: true }, // Product name instead of ID
        quantity: { type: Number, required: true, min: 1 },
        unit: { type: String, required: true }, // Example: kg, meters, tons
        pricePerUnit: { type: Number, required: true },
        totalPrice: { type: Number, required: true }
      }
    ], // List of ordered items

    totalCost: { type: Number, required: true }, // Total order cost

    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'],
      default: 'Pending'
    }, // Order status

    discount: { 
      type: Number, 
      default: 0, 
      min: 0, 
    },

    fieldAgentName: { type: String, default: '' }, // Name of the field agent

    additionalCosts: [
      {
        cost: { type: Number, required: true }, // Additional cost value (e.g., taxes, shipping, etc.)
        reason: { type: String, required: true }, // Reason for the additional cost (e.g., "tax", "shipping")
        dateAdded: { type: Date, default: Date.now } // When the additional cost was added
      }
    ],

    shipmentDetails: {
      trackingNumber: { type: String, default: '' },
      expectedDeliveryDate: { type: Date },
      actualDeliveryDate: { type: Date },
      deliveryStatus: {
        type: String,
        enum: ['Not Shipped', 'In Transit', 'Delayed', 'Delivered'],
        default: 'Not Shipped'
      }
    }, // Shipment tracking details

    procurementAgentUpdates: [
      {
        agentName: { type: String, required: true }, // Name of procurement agent
        status: { type: String, enum: ['Verified', 'Rejected', 'Delayed'], default: 'Verified' },
        remarks: { type: String },
        date: { type: Date, default: Date.now }
      }
    ], // Procurement Agent Notes

    fieldAgentUpdates: [
      {
        agentName: { type: String, required: true }, // Name of field agent
        status: { type: String, enum: ['Checked', 'Delayed', 'Issue Found'], default: 'Checked' },
        remarks: { type: String },
        date: { type: Date, default: Date.now }
      }
    ], // Field Agent Notes
    companyName: {
      type: String,
      trim: true,
    },
    walletAddress: {
      type: String,
      trim: true,
    },
    inoviceNumber: {
      type: String,
      trim: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const ProcurementOrder = mongoose.model('ProcurementOrder', procurementOrderSchema);

module.exports= ProcurementOrder;


