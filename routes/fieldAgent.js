const express = require('express');
const router = express.Router();
const controller = require('../controllers/fieldAgent');

// Create a new field agent
router.post('/create', controller.createAgent);

// Get all field agents
router.get('/all', controller.getAllAgents);

// Get one agent by ID (using query: ?id=)
router.get('/get', controller.getAgentById);

// Update agent by ID (using query: ?id=)
router.put('/update', controller.updateAgent);

// Delete agent by ID (using query: ?id=)
router.delete('/delete', controller.deleteAgent);

// Authenticate agent (body: { employeeId, name, role })
router.post('/auth', controller.authenticateAgent);

module.exports = router;
