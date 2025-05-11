const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  description: { type: String },
  unit: { type: String, required: true }, // Example: kg, meters, pieces
  pricePerUnit: { type: Number, required: true },
  supplier: { type: String, required: true },
  category: { type: String }, // For categorization like Raw Material, Finished Goods, etc.
  imageUrl: { type: String }, // Optional, for product images

  // Stock related fields directly included in the Product schema
  stockQuantity: { type: Number, required: true }, // Current stock quantity
  reorderLevel: { type: Number, required: true }, // Minimum stock level before reorder

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  companyName: {
    type: String,
    trim: true,
  },
  walletAddress: {
    type: String,
    trim: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
