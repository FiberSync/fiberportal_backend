const FieldAgent = require('../models/fieldAgent');

// Create a new Field Agent
exports.createAgent = async (req, res) => {
  try {
    const { employeeId, name, role } = req.body;

    const newAgent = new FieldAgent({ employeeId, name, role });
    await newAgent.save();

    res.status(201).json({ message: 'Field agent created successfully', agent: newAgent });
  } catch (error) {
    res.status(500).json({ message: 'Error creating field agent', error: error.message });
  }
};

// Get all Field Agents
exports.getAllAgents = async (req, res) => {
  try {
    const agents = await FieldAgent.find();
    res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching agents', error: error.message });
  }
};

// Get one agent by ID
exports.getAgentById = async (req, res) => {
  try {
    const agent = await FieldAgent.findById(req.query.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });

    res.status(200).json(agent);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching agent', error: error.message });
  }
};

// Update an agent
exports.updateAgent = async (req, res) => {
  try {
    const { employeeId, name, role } = req.body;
    const updatedAgent = await FieldAgent.findByIdAndUpdate(
      req.query.id,
      { employeeId, name, role, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedAgent) return res.status(404).json({ message: 'Agent not found' });

    res.status(200).json({ message: 'Agent updated successfully', agent: updatedAgent });
  } catch (error) {
    res.status(500).json({ message: 'Error updating agent', error: error.message });
  }
};

// Delete an agent
exports.deleteAgent = async (req, res) => {
  try {
    const deleted = await FieldAgent.findByIdAndDelete(req.query.id);
    if (!deleted) return res.status(404).json({ message: 'Agent not found' });

    res.status(200).json({ message: 'Agent deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting agent', error: error.message });
  }
};

// Authenticate a field agent by ID, name, and role
exports.authenticateAgent = async (req, res) => {
  try {
    const { employeeId, name, role } = req.body;

    const agent = await FieldAgent.findOne({ employeeId, name, role });

    if (agent) {
      res.status(200).json({ auth: true, message: 'Authentication successful', agent });
    } else {
      res.status(401).json({ auth: false, message: 'Authentication failed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error during authentication', error: error.message });
  }
};
