const Dyeing = require('../models/dyeing'); // Import the dyeing model

// CREATE a new dyeing record
exports.createDyeingRecord = async (req, res) => {
  try {
    const dyeingRecord = new Dyeing({
      orderId: req.body.orderId,
      batchNumber: req.body.batchNumber,
      companyName: req.body.companyName,
      walletAddress: req.body.walletAddress,
      dyeingDetails: req.body.dyeingDetails,
      machineDetails: req.body.machineDetails,
      status: req.body.status || 'Pending', // Default to 'Pending'
      remarks: req.body.remarks || [],
      qualityMetrics: req.body.qualityMetrics,
      productionData: req.body.productionData,
    });

    const newRecord = await dyeingRecord.save();
    res.status(201).json({
      message: 'Dyeing record created successfully!',
      record: newRecord,
    });
  } catch (error) {
    console.error('Error creating dyeing record:', error);
    res.status(500).json({ message: 'Error creating dyeing record' });
  }
};

// READ all dyeing records (filter by query params)
exports.getAllDyeingRecords = async (req, res) => {
  try {
    const { companyName, walletAddress } = req.query;
    const query = {};

    
    if (walletAddress) query.walletAddress = walletAddress;

    const records = await Dyeing.find(query);
    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching dyeing records:', error);
    res.status(500).json({ message: 'Error fetching dyeing records',error });
  }
};

// READ a single dyeing record by ID
exports.getDyeingRecordById = async (req, res) => {
  try {
    const record = await Dyeing.findById(req.query.id);
    if (!record) {
      return res.status(404).json({ message: 'Dyeing record not found' });
    }
    res.status(200).json(record);
  } catch (error) {
    console.error('Error fetching dyeing record:', error);
    res.status(500).json({ message: 'Error fetching dyeing record' });
  }
};

// UPDATE an existing dyeing record
exports.updateDyeingRecord = async (req, res) => {
  try {
    const updatedRecord = await Dyeing.findByIdAndUpdate(
      req.query.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRecord) {
      return res.status(404).json({ message: 'Dyeing record not found' });
    }
    res.status(200).json({
      message: 'Dyeing record updated successfully!',
      record: updatedRecord,
    });
  } catch (error) {
    console.error('Error updating dyeing record:', error);
    res.status(500).json({ message: 'Error updating dyeing record' });
  }
};

// DELETE a dyeing record
exports.deleteDyeingRecord = async (req, res) => {
  try {
    const deletedRecord = await Dyeing.findByIdAndDelete(req.query.id);
    if (!deletedRecord) {
      return res.status(404).json({ message: 'Dyeing record not found' });
    }
    res.status(200).json({ message: 'Dyeing record deleted successfully!' });
  } catch (error) {
    console.error('Error deleting dyeing record:', error);
    res.status(500).json({ message: 'Error deleting dyeing record' });
  }
};

// Additional feature: GET dyeing records for a specific company
exports.getDyeingRecordsByCompany = async (req, res) => {
  try {
    const { companyName } = req.query;
    const records = await Dyeing.find({ companyName });
    if (records.length === 0) {
      return res.status(404).json({ message: 'No dyeing records found for this company' });
    }
    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching dyeing records by company:', error);
    res.status(500).json({ message: 'Error fetching dyeing records by company' });
  }
};

// Example of getting a summary (e.g., number of units dyed for a batch)
exports.getProductionSummary = async (req, res) => {
  try {
    const summary = await Dyeing.aggregate([
      {
        $group: {
          _id: '$batchNumber',
          totalQuantityDyed: { $sum: '$productionData.quantityDyed' },
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
