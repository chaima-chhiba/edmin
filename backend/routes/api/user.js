const express = require('express')
const router = express.Router()

const user = require('../../controllers/user')

router.get('/users/:id', user.getUser);
router.get('/users', user.getAllUsers);


// Update user by ID
router.put('/users/:id', user.updateUser);

// Delete user by ID
router.delete('/users/:id', user.deleteUser);

router.post('/admin/create-user',user.addUser);
router.get('/check-username/:username', user.checkUsernameExists);
router.put('/users/:id/status', user.updateUserStatus);
router.put('/profile', user.updateProfile); 
router.put('/update-password', user.updatePassword);
router.put('/update-username', user.updateUsername);
router.get('/profile', user.fetchUserProfile)
router.get('/avatar', user.fetchUserAvatar)
module.exports = router