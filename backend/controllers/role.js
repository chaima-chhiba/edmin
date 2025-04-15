const Role = require('../models/Role');
const { ObjectId } = require('mongoose').Types;

async function addRole(req, res) {
    try {
        const { name, accessList } = req.body;

        if (!name || !accessList) {
            return res.status(400).json({ code: 400, message: 'Bad Request' });
        }

        const existingRole = await Role.findOne({ name });

        if (existingRole) {
            return res.status(400).json({ code: 400, message: 'Role already exists' });
        }

        const newRole = new Role({ name, accessList });
        const savedRole = await newRole.save();

        return res.status(201).json({ code: 201, message: 'Role Added Successfully', role: savedRole });
    } catch (err) {
        console.error('Add Role Error:', err);

        if (err.name === 'ValidationError') {
            return res.status(400).json({ code: 400, message: 'Validation Error', errors: err.errors });
        }

        return res.status(500).json({ code: 500, message: 'Server Error' });
    }
}

async function getRole(req, res) {
    try {
        const roleId = req.params.id;
        const role = await Role.findById(roleId);

        if (!role) {
            return res.status(404).json({ code: 404, message: 'Role not found' });
        }

        return res.status(200).json({ code: 200, role });
    } catch (err) {
        console.error('Get Role Error:', err);
        return res.status(500).json({ code: 500, message: 'Server Error' });
    }
}

async function getAllRoles(req, res) {
    try {
        const roles = await Role.find();
        return res.status(200).json({ code: 200, roles });
    } catch (err) {
        console.error('Get All Roles Error:', err);
        return res.status(500).json({ code: 500, message: 'Server Error' });
    }
}

async function updateRole(req, res) {
    
    const roleId = req.params.id;
    if (!roleId) {
        return res.status(400).json({ code: 400, message: 'Role ID is required' });
    }
    
    const updateData = req.body;
    // Make sure _id is not undefined
   
    
    try {
        const updatedRole = await Role.findByIdAndUpdate(roleId, updateData, { new: true });
    
        if (!updatedRole) {
            return res.status(404).json({ code: 404, message: 'Role not found' });
        }
    
        return res.status(200).json({ code: 200, message: 'Role updated successfully', role: updatedRole });
    } catch (err) {
        console.error('Update Role Error:', err);
        return res.status(500).json({ code: 500, message: 'Server Error' });
    }
    
}

async function deleteRole(req, res) {
    try {
      const roleId = req.params.id;
  
      // Check if roleId is a valid ObjectId
      if (!ObjectId.isValid(roleId)) {
        return res.status(400).json({ error: 'Invalid role ID' });
      }
  
      // Continue with the deletion logic
      const deletedRole = await Role.findOneAndDelete({ _id: roleId });
  
      if (!deletedRole) {
        return res.status(404).json({ error: 'Role not found' });
      }
  
      return res.status(200).json(deletedRole);
    } catch (error) {
      console.error('Error deleting role:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

module.exports = { addRole, getRole, updateRole, deleteRole, getAllRoles };
