const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  orderNumber: { type: String, required: true },
  supplierName: { type: String, required: true },
  totalCost: { type: Number, required: true },
  additionalCosts: { type: Number, default: 0 },
  dueDate: { type: Date, required: true },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Partially Paid'],
    default: 'Unpaid',
  },
  paymentDate: { type: Date },
  paymentAmount: { type: Number, default: 0 },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
