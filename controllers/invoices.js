const Invoice = require('../models/invoices');

// Get invoice by order number
const getInvoiceByOrder = async (req, res) => {
  try {
    const { orderNumber } = req.query;
    const invoice = await Invoice.findOne({ orderNumber });

    if (!invoice) {
      return res.status(404).send('Invoice not found');
    }

    res.json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching invoice');
  }
};

// Get all invoices
const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({});

    res.json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching invoices');
  }
};

const updatePaymentStatus = async (req, res) => {
    try {
      const { invoiceNumber, paymentAmount } = req.body;
      const invoice = await Invoice.findOne({ invoiceNumber });
  
      if (!invoice) {
        return res.status(404).send("Invoice not found");
      }
  
      // Update payment status
      if (paymentAmount >= invoice.totalCost) {
        invoice.paymentStatus = "Paid";
        invoice.paymentDate = new Date();
      } else if (paymentAmount > 0) {
        invoice.paymentStatus = "Partially Paid";
        invoice.paymentAmount = paymentAmount;
      } else {
        invoice.paymentStatus = "Unpaid";
      }
  
      await invoice.save();
  
      res.json({ message: "Payment status updated", invoice });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating payment status");
    }
};

const updateInvoicePayment = async (req, res) => {
    try {
      const { invoiceNumber, paymentStatus, paymentAmount, paymentDate } = req.body;
  
      // Find the invoice by invoiceNumber
      const invoice = await Invoice.findOne({ invoiceNumber });
      
      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
  
      // Update the invoice fields
      invoice.paymentStatus = paymentStatus;
      invoice.paymentAmount = paymentAmount;
      invoice.paymentDate = paymentDate || new Date(); // If paymentDate is not provided, use the current date
  
      // Save the updated invoice
      await invoice.save();
  
      res.status(200).json({
        message: "Invoice payment status updated successfully",
        updatedInvoice: invoice
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating invoice payment", error: error.message });
    }
  };
  




const updateInvoiceStatus = async (req, res) => {
  try {
    const { invoiceNumber, paymentStatus } = req.body;

    // Find the invoice by invoiceNumber
    const invoice = await Invoice.findOne({ invoiceNumber });
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Update the payment status
    invoice.paymentStatus = paymentStatus;

    // Save the updated invoice
    await invoice.save();

    res.status(200).json({
      message: "Invoice status updated successfully",
      updatedInvoice: invoice
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating invoice status", error: error.message });
  }
};





const extendInvoiceDueDate = async (req, res) => {
  try {
    const { invoiceNumber, newDueDate } = req.body;

    // Find the invoice by invoiceNumber
    const invoice = await Invoice.findOne({ invoiceNumber });
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Update the due date
    invoice.dueDate = newDueDate;

    // Save the updated invoice
    await invoice.save();

    res.status(200).json({
      message: "Invoice due date extended successfully",
      updatedInvoice: invoice
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error extending invoice due date", error: error.message });
  }
};




module.exports = {
  getInvoiceByOrder,
  getAllInvoices,
  updatePaymentStatus,
  extendInvoiceDueDate,
  updateInvoiceStatus,
  updateInvoicePayment
};

