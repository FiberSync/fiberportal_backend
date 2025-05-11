const mongoose = require('mongoose');

const spinningSchema = new mongoose.Schema({
  orderId: { type: String, required: true },  // This links to the Order
  batchNumber: { type: String, required: true },
  companyName: { type: String, required: true },  // New field for company name
  walletAddress: { type: String, required: true },  // New field for wallet address
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'On Hold'],
    default: 'Pending'
  },
  remarks: [{
    message: String,
    updatedBy: String,
    date: { type: Date, default: Date.now }
  }],
  qualityMetrics: {
    tearStrength: { warp: Number, weft: Number },  // These may be retained if spinning quality checks are needed
    tensileStrength: { warp: Number, weft: Number },  // Similar with tensile strength
    stretch: Number,
    shrinkage: { warp: String, weft: String }  // Shrinkage related to warp/weft
  },
  productionData: {
    startTime: Date,
    endTime: Date,
    machineUtilization: Number,  // This could reflect machine efficiency in spinning
    outputPerHour: Number,  // How much output in terms of weight per hour (oz/hr, lb/shift)
    yarnCount: { type: String, required: true },  // Yarn count (finest thickness of the yarn)
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Spinning', spinningSchema);
