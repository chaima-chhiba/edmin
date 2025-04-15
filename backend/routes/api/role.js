const express = require('express');
const router = express.Router();
const roleController = require('../../controllers/role');
// Middleware to authenticate the role as admin


// Route for creating a new role
router.post('/', roleController.addRole);

// Route for getting all roles
router.get('/', roleController.getAllRoles);

// Route for getting a specific role by ID
router.get('/:id', roleController.getRole);

// Route for updating a specific role by ID
router.put('/:id', roleController.updateRole);

// Route for deleting a specific role by ID
router.delete('/:id', roleController.deleteRole);

module.exports = router;
