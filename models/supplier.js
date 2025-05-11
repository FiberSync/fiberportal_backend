const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  description: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  productsOffered: [{
    type: String,
    trim: true,
  }],
  leadTime: {
    type: String,
    trim: true,
  },
  minimumOrderQuantity: {
    type: Number,
  },
  paymentTerms: {
    type: String,
    trim: true,
  },
  companyName: {
    type: String,
    trim: true,
  },
  walletAddress: {
    type: String,
    trim: true,
  },
  qualityCertifications: [{
    type: String,
    trim: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;
