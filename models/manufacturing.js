const mongoose = require('mongoose');

const manufacturingSchema = new mongoose.Schema({
  orderId: { type: String,required: true },
  batchNumber: { type: String, required: true },
  companyName: { type: String, required: true },
  walletAddress: { type: String, required: true },
  productDetails: {
    productCode: String,
    productType: String,
    sizeSpecs: String,
    stitchingDetails: String,
    components: [{
      name: String,
      quantity: Number,
      material: String
    }]
  },
  machineDetails: {
    machineType: String,
    machineNumber: String,
    efficiency: Number
  },
  status: {
    type: String,
    enum: ['Pending', 'Cutting', 'Stitching', 'Assembly', 'Completed', 'On Hold'],
    default: 'Pending'
  },
  remarks: [{
    message: String,
    updatedBy: String,
    date: { type: Date, default: Date.now }
  }],
  qualityMetrics: {
    stitchQuality: String,
    seamStrength: Number,
    dimensionalAccuracy: String,
    defectsCount: Number
  },
  productionData: {
    startTime: Date,
    endTime: Date,
    unitsProduced: Number,
    productionRate: Number
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Manufacturing', manufacturingSchema);