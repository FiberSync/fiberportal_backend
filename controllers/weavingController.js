const Weaving = require('../models/weaving'); // Import the Weaving model
const mongoose = require('mongoose');

// Create a new weaving record
const createWeaving = async (req, res) => {
  try {
    // Ensure companyName and walletAddress match
    console.log(req.body);
    const { companyName, walletAddress, fabricDetails, loomDetails, status, remarks, qualityMetrics, productionData } = req.body;
 
    const newWeaving = new Weaving({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newWeaving.save();
    return res.status(201).json(newWeaving);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Get all weaving records for a specific company and wallet address
const getAllWeavings = async (req, res) => {
  const { companyName, walletAddress } = req.query;

  try {
    // Ensure companyName and walletAddress match


    const weavings = await Weaving.find({ walletAddress });
    return res.status(200).json(weavings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update a weaving record based on batch number
const updateWeaving = async (req, res) => {
  const { companyName, walletAddress, batchNumber } = req.query;
  const { fabricDetails, loomDetails, status, remarks, qualityMetrics, productionData } = req.body;

  try {
    // Ensure companyName and walletAddress match


    const updatedWeaving = await Weaving.findOneAndUpdate(
      { walletAddress, batchNumber },
      { 
        fabricDetails, 
        loomDetails, 
        status, 
        remarks, 
        qualityMetrics, 
        productionData, 
        updatedAt: new Date() 
      },
      { new: true }
    );

    if (!updatedWeaving) {
      return res.status(404).json({ message: "Weaving record not found" });
    }

    return res.status(200).json(updatedWeaving);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete a weaving record based on batch number
const deleteWeaving = async (req, res) => {
  const { companyName, walletAddress, batchNumber } = req.query;

  try {


    const deletedWeaving = await Weaving.findOneAndDelete({ companyName, walletAddress, batchNumber });
    if (!deletedWeaving) {
      return res.status(404).json({ message: "Weaving record not found" });
    }

    return res.status(200).json({ message: "Weaving record deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateWeavingRecordFA = async (req, res) => {
  try {
    const {
      orderId,
      batchNumber,
      status,
      remarkMessage,
      role,
      qualityMetrics
    } = req.body;

    console.log('Incoming Weaving Update:', req.body);

    // Find the weaving record
    const record = await Weaving.findOne({ orderId, batchNumber });

    if (!record) {
      console.log('Weaving record not found');
      return res.status(404).json({ message: 'Weaving record not found' });
    }

    // Create a new remark entry
    const remarkEntry = {
      message: remarkMessage,
      updatedBy: role,
      date: new Date()
    };

    // Apply updates
    if (status) record.status = status;
    if (remarkMessage && role) {
      record.remarks.push(remarkEntry);
    }

    if (qualityMetrics) {
      record.qualityMetrics = {
        ...record.qualityMetrics,
        ...qualityMetrics
      };
    }

    record.updatedAt = new Date();

    // Save and respond
    const updatedRecord = await record.save();

    res.status(200).json({
      message: 'Weaving record updated successfully',
      data: updatedRecord
    });

  } catch (error) {
    console.error('Error updating weaving record:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createWeaving,
  getAllWeavings,
  updateWeaving,
  deleteWeaving,
  updateWeavingRecordFA
};
