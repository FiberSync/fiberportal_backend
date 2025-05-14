const Spinning = require('../models/spinning');

// Create a new spinning record
exports.createSpinning = async (req, res) => {
  try {
    // Create a new Spinning document based on the incoming request body
    const newSpinning = new Spinning({
      orderId: req.body.orderId,
      batchNumber: req.body.batchNumber,
      companyName: req.body.companyName,
      walletAddress: req.body.walletAddress,
      status: req.body.status || 'Pending',  // Default to 'Pending' if not provided
      remarks: req.body.remarks || [],  // Empty array if no remarks are provided
      qualityMetrics: req.body.qualityMetrics || {},  // Use empty object if no metrics
      productionData: req.body.productionData || {},  // Use empty object if no production data
    });

    // Save the new spinning record to the database
    const savedSpinning = await newSpinning.save();
    res.status(201).json(savedSpinning);  // Respond with the saved record
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating spinning record', error });
  }
};

// Get all spinning records with optional filtering by companyName and walletAddress
exports.getAllSpinnings = async (req, res) => {
  try {
    const { companyName, walletAddress } = req.query;  // Get filter parameters from the query string

    const filter = {};

    // Add companyName to the filter if provided
    // if (companyName) {
    //   filter.companyName = companyName;
    // }

    // Add walletAddress to the filter if provided
    if (walletAddress) {
      filter.walletAddress = walletAddress;
    }

    // Find spinnings in the database matching the filter
    const spinnings = await Spinning.find(filter);
    res.status(200).json(spinnings);  // Respond with the matching records
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching spinnings', error });
  }
};

// Get a single spinning record by ID
exports.getSpinningById = async (req, res) => {
  try {
    // Get spinning record by ID from the database using query parameter 'id'
    const spinning = await Spinning.findById(req.query.id);
    if (!spinning) {
      return res.status(404).json({ message: 'Spinning record not found' });
    }
    res.status(200).json(spinning);  // Respond with the found spinning record
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching spinning record', error });
  }
};

// Update a spinning record by ID
exports.updateSpinning = async (req, res) => {
  try {
    // Find and update the spinning record by ID
    const updatedSpinning = await Spinning.findByIdAndUpdate(
      req.query.id,  // Get the ID from the query parameter
      {
        $set: req.body,  // Update with the data from the request body
      },
      { new: true }  // Return the updated document
    );

    if (!updatedSpinning) {
      return res.status(404).json({ message: 'Spinning record not found' });
    }

    res.status(200).json(updatedSpinning);  // Respond with the updated spinning record
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating spinning record', error });
  }
};

// Delete a spinning record by ID
exports.deleteSpinning = async (req, res) => {
  try {
    // Delete the spinning record by ID from the database
    const deletedSpinning = await Spinning.findByIdAndDelete(req.query.id);
    if (!deletedSpinning) {
      return res.status(404).json({ message: 'Spinning record not found' });
    }

    res.status(200).json({ message: 'Spinning record deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting spinning record', error });
  }
};


exports.updateSpinningFAApp = async (req, res) => {
  try {
    const { orderId, batchNumber, status, remarkMessage, role, qualityMetrics } = req.body;

    if (!orderId || !batchNumber || !status || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const spinningRecord = await Spinning.findOne({ orderId, batchNumber });

    if (!spinningRecord) {
      return res.status(404).json({ message: 'Spinning record not found' });
    }

    // Update status
    spinningRecord.status = status;

    // Add remark
    spinningRecord.remarks.push({
      message: remarkMessage,
      updatedBy: role,
      date: new Date()
    });

    
    if (qualityMetrics) {
      spinningRecord.qualityMetrics = {
        ...spinningRecord.qualityMetrics,
        ...qualityMetrics
      };
    }

    spinningRecord.updatedAt = new Date();

    await spinningRecord.save();

    res.status(200).json({ message: 'Spinning record updated successfully' });
  } catch (error) {
    console.error('Error updating spinning record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

