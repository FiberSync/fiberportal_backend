const mongoose = require('mongoose');

const weavingSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  batchNumber: { type: String, required: true },
  companyName: { type: String, required: true },
  walletAddress: { type: String, required: true },
  fabricDetails: {
    fabricCode: String,
    reedCount: String,
    warpCount: Number,
    weftCount: Number,
    picksPerInch: Number,
    fabricWidth: Number,
    fabricComposition: String,
    weaveType: String
  },
  loomDetails: {
    loomType: String,
    loomNumber: String,
    efficiency: Number
  },
  status: {
    type: String,
    enum: ['Pending', 'On Loom', 'Completed', 'On Hold'],
    default: 'Pending'
  },
  remarks: [{
    message: String,
    updatedBy: String,
    date: { type: Date, default: Date.now }
  }],
  qualityMetrics: {
    endsDown: Number,
    picksDown: Number,
    fabricDefects: Number,
    GSM: Number
  },
  productionData: {
    startTime: Date,
    endTime: Date,
    metersWoven: Number,
    productionRate: Number
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Weaving', weavingSchema);