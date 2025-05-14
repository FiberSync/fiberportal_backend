const Manufacturing = require('../models/manufacturing'); // Import the manufacturing model

// CREATE a new manufacturing record
exports.createManufacturingRecord = async (req, res) => {
  try {
    const manufacturingRecord = new Manufacturing({
      orderId: req.body.orderId,
      batchNumber: req.body.batchNumber,
      companyName: req.body.companyName,
      walletAddress: req.body.walletAddress,
      productDetails: req.body.productDetails,
      machineDetails: req.body.machineDetails,
      status: req.body.status || 'Pending', // Default to 'Pending'
      remarks: req.body.remarks || [],
      qualityMetrics: req.body.qualityMetrics,
      productionData: req.body.productionData,
    });

    const newRecord = await manufacturingRecord.save();
    res.status(201).json({
      message: 'Manufacturing record created successfully!',
      record: newRecord,
    });
  } catch (error) {
    console.error('Error creating manufacturing record:', error);
    res.status(500).json({ message: 'Error creating manufacturing record' });
  }
};

// READ all manufacturing records
exports.getAllManufacturingRecords = async (req, res) => {
  try {
    const {companyName,walletAddress} = req.query;
    const records = await Manufacturing.find({walletAddress});
    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching manufacturing records:', error);
    res.status(500).json({ message: 'Error fetching manufacturing records' });
  }
};

// READ a single manufacturing record by ID
exports.getManufacturingRecordById = async (req, res) => {
  try {
    const record = await Manufacturing.findById(req.query.id);
    if (!record) {
      return res.status(404).json({ message: 'Manufacturing record not found' });
    }
    res.status(200).json(record);
  } catch (error) {
    console.error('Error fetching manufacturing record:', error);
    res.status(500).json({ message: 'Error fetching manufacturing record' });
  }
};

// UPDATE an existing manufacturing record
exports.updateManufacturingRecord = async (req, res) => {
  try {
    const updatedRecord = await Manufacturing.findByIdAndUpdate(
      req.query.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRecord) {
      return res.status(404).json({ message: 'Manufacturing record not found' });
    }
    res.status(200).json({
      message: 'Manufacturing record updated successfully!',
      record: updatedRecord,
    });
  } catch (error) {
    console.error('Error updating manufacturing record:', error);
    res.status(500).json({ message: 'Error updating manufacturing record' });
  }
};

// DELETE a manufacturing record
exports.deleteManufacturingRecord = async (req, res) => {
  try {
    const deletedRecord = await Manufacturing.findByIdAndDelete(req.query.id);
    if (!deletedRecord) {
      return res.status(404).json({ message: 'Manufacturing record not found' });
    }
    res.status(200).json({ message: 'Manufacturing record deleted successfully!' });
  } catch (error) {
    console.error('Error deleting manufacturing record:', error);
    res.status(500).json({ message: 'Error deleting manufacturing record' });
  }
};

// Additional feature: GET all manufacturing records for a specific company
exports.getManufacturingRecordsByCompany = async (req, res) => {
  try {
    const { companyName } = req.query;
    const records = await Manufacturing.find({ companyName });
    if (records.length === 0) {
      return res.status(404).json({ message: 'No manufacturing records found for this company' });
    }
    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching manufacturing records by company:', error);
    res.status(500).json({ message: 'Error fetching manufacturing records by company' });
  }
};

// Example of getting a summary (e.g., number of units produced for a batch)
exports.getProductionSummary = async (req, res) => {
  try {
    const summary = await Manufacturing.aggregate([
      {
        $group: {
          _id: '$batchNumber',
          totalUnitsProduced: { $sum: '$productionData.unitsProduced' },
          averageProductionRate: { $avg: '$productionData.productionRate' },
        },
      },
    ]);
    res.status(200).json(summary);
  } catch (error) {
    console.error('Error generating production summary:', error);
    res.status(500).json({ message: 'Error generating production summary' });
  }
};


exports.updateManufacturingRecordFA = async (req, res) => {
  try {
    const {
      orderId,
      batchNumber,
      status,
      remarkMessage,
      role,
      qualityMetrics
    } = req.body;

    // Find the manufacturing record
    const record = await Manufacturing.findOne({ orderId, batchNumber });

    if (!record) {
      return res.status(404).json({ message: 'Manufacturing record not found' });
    }

    // Create a new remark entry
    const remarkEntry = {
      message: remarkMessage,
      updatedBy: role,
      date: new Date()
    };

    // Apply updates
    if (status) record.status = status;
    record.remarks.push(remarkEntry);
    record.qualityMetrics = {
      ...record.qualityMetrics,
      ...qualityMetrics
    };
    record.updatedAt = new Date();

    // Save and respond
    const updatedRecord = await record.save();

    res.status(200).json({
      message: 'Manufacturing record updated successfully',
      data: updatedRecord
    });

  } catch (error) {
    console.error('Error updating manufacturing record:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
