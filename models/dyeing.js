const mongoose = require('mongoose');

const dyeingSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  batchNumber: { type: String, required: true },
  companyName: { type: String, required: true },
  walletAddress: { type: String, required: true },
  dyeingDetails: {
    dyeType: String,
    colorCode: String,
    shade: String,
    chemicalComposition: [{
      chemical: String,
      quantity: Number,
      unit: String
    }],
    dyeingMethod: String,
    temperature: Number
  },
  machineDetails: {
    machineType: String,
    machineNumber: String,
    capacity: Number
  },
  status: {
    type: String,
    enum: ['Pending', 'Preparation', 'Dyeing', 'Washing', 'Drying', 'Completed', 'On Hold'],
    default: 'Pending'
  },
  remarks: [{
    message: String,
    updatedBy: String,
    date: { type: Date, default: Date.now }
  }],
  qualityMetrics: {
    colorFastness: Number,
    pHLevel: Number,
    shrinkage: Number,
    defects: Number
  },
  productionData: {
    startTime: Date,
    endTime: Date,
    quantityDyed: Number,
    productionRate: Number
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dyeing', dyeingSchema);