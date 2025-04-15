const express = require('express');
const router = express.Router();
const clientController = require('../../controllers/Client');

// Route to add a new client
router.post('/', clientController.addClient);

// Route to get a client by ID
router.get('/:id', clientController.getClient);

// Route to update a client by ID
router.put('/:id', clientController.updateClient);

// Route to delete a client by ID
router.delete('/:id', clientController.deleteClient);

// Route to disable a client by ID
router.put('/:id/disable', clientController.disableClient);

// Route to get all clients
router.get('/', clientController.getAllClients);

// Route to filter clients
router.post('/filter', clientController.filterClients);

// Route to check if a client exists by HubSpot ID
router.get('/check-client/:idHubSpot', clientController.checkClientByHubSpotId);

module.exports = router;
