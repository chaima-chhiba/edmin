const bcrypt = require('bcrypt')
const Role = require('../models/Role');
const User = require('../models/User')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const ObjectId = mongoose.Types.ObjectId;
async function addUser(req, res) {
  try {
      // Extracting data from the request body
      const { username, email, first_name, last_name, password, avatar, addresses, role_name} = req.body;

      // Checking if required data is present
      if (!username || !email || !first_name || !last_name || !password || !role_name) {
          return res.status(400).json({ code: 400, message: 'Bad Request' });
      }

      // Hashing the password before saving to the database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Check if the role already exists
      let role = await Role.findOne({ name: role_name });

      // If the role doesn't exist, return an error
      if (!role) {
          return res.status(400).json({ code: 400, message: 'Role not found' });
      }

      // Creating a new user instance with the extracted data and assigned role
      const newUser = new User({
          username,
          email,
          first_name,
          last_name,
          password: hashedPassword,
          avatar,
          addresses,
          role: role._id,
      });

      // Saving the new user to the database
      const response = await newUser.save();

      // Responding with success message if user is added successfully
      if (response) {
          return res.status(200).json({ code: 200, message: 'User Added Success' });
      } else {
          // Log details for troubleshooting
          console.error('User save response:', response);
          return res.status(500).json({ code: 500, message: 'User creation failed' });
      }
  } catch (err) {
      // Log specific error details for troubleshooting
      console.error('Add User Error:', err);

      // Check for Mongoose validation errors
      if (err.name === 'ValidationError') {
          return res.status(400).json({ code: 400, message: 'Validation Error', errors: err.errors });
      }

      // Check for MongoDB connection errors
      if (err.name === 'MongoError' && err.message.includes('ECONNREFUSED')) {
          return res.status(500).json({ code: 500, message: 'Unable to connect to the database' });
      }

      // Handling any other errors
      return res.status(500).json({ code: 500, message: 'Server Error' });
  }
}
// Get user by ID
async function getUser(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate('role');

    if (!user) {
      return res.status(404).json({ code: 404, message: 'User not found' });
    }

    return res.status(200).json({ code: 200, user });
  } catch (err) {
    console.error('Get User Error:', err);
    return res.status(500).json({ code: 500, message: 'Server Error' });
  }
}
async function getAllUsers(req, res) {
  try {
    const users = await User.find().populate('role'); 

    return res.status(200).json({ code: 200, users });
  } catch (err) {
    console.error('Get All Users Error:', err);
    return res.status(500).json({ code: 500, message: 'Server Error' });
  }
}
  
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    // Fetch the role document based on its name
    const role = await Role.findOne({ name: updateData.role_name });

    if (role) {
      // Update the user's role with the role ID
      updateData.role = role._id; // Assuming 'role' is the field that stores the role ObjectId

      const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ code: 404, message: 'User not found' });
      }

      return res.status(200).json({ code: 200, message: 'User updated successfully', user: updatedUser });
    } else {
      return res.status(404).json({ code: 404, message: 'Role not found' });
    }
  } catch (err) {
    console.error('Update User Error:', err);
    return res.status(500).json({ code: 500, message: 'Server Error' });
  }
};

 async function deleteUser(req, res) {
  try {
    const userId = req.params.id;

    // Check if userId is a valid ObjectId
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Continue with the deletion logic
    const deletedUser = await User.findOneAndDelete({ _id: userId });

    if (!deletedUser) {
      return res.status(404).json({ code: 404, message: 'User not found' });
    }

    return res.status(200).json({ code: 200, message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete User Error:', err);
    return res.status(500).json({ code: 500, message: 'Server Error' });
  }
}
async function checkUsernameExists(req, res) {
  try {
    let username = req.params.username;

    // Trim leading and trailing spaces from the username
    username = username.trim();

    // Check if the username already exists, ignoring trailing spaces
    const existingUser = await User.findOne({ username: { $regex: `^${username}$`, $options: 'i' } });

    return res.status(200).json({ exists: !!existingUser });
  } catch (err) {
    console.error('Check Username Exists Error:', err);
    return res.status(500).json({ code: 500, message: 'Server Error' });
  }
}
async function updateUserStatus(req, res) {
  try {
    const userId = req.params.id;
    const { status } = req.body;

  
    // Find the user by ID and update the status
    const updatedUser = await User.findByIdAndUpdate(userId, { status }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ code: 404, message: 'User not found' });
    }

    return res.status(200).json({ code: 200, message: 'User status updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Update User Status Error:', err);
    return res.status(500).json({ code: 500, message: 'Server Error' });

  }
}
// Async function to update user profile details
async function updateProfile(req, res) {
  try {
    // Extract user information from the token
    const token = req.headers.authorization.split(' ')[1]; // Assuming token is sent in the Authorization header
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verify and decode the token
    const userId = decodedToken.id; // Assuming the user ID is stored in the token

    // Extract updated profile details from the request body
    const {  avatar,first_name,last_name  } = req.body;

    // Find user by ID and update the profile details
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {  avatar,first_name,last_name} , // Update fields as needed
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ code: 404, message: 'User not found' });
    }

    // Return updated user profile details
    res.status(200).json({ code: 200, message: 'User profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ code: 500, message: 'Internal Server Error' });
  }
}


// Async function to update user's password
async function updatePassword(req, res) {
  try {
    const { currentpassword, newpassword, confirmnewpassword } = req.body;

    // Check if currentPassword and newPassword are defined and not null
    if (!currentpassword || !newpassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    // Extract user information from the token
    const token = req.headers.authorization.split(' ')[1]; // Assuming token is sent in the Authorization header
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verify and decode the token
    const userId = decodedToken.id; // Assuming the user ID is stored in the token

    // Find user by ID
    const user = await User.findById(userId).exec();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

  

   // Check if hashed current password matches the hashed password stored in the database
   const match = await bcrypt.compare(currentpassword, user.password);
   if (!match) {
     return res.status(401).json({ message: 'Current password is incorrect' });
   }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newpassword, 10); // Ensure newPassword is a string

    // Update user's password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
// Async function to update username
async function updateUsername(req, res) {
  try {
    // Extract user information from the token
    const token = req.headers.authorization.split(' ')[1]; // Assuming token is sent in the Authorization header
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verify and decode the token
    const userId = decodedToken.id; // Assuming the user ID is stored in the token

    // Extract updated username from the request body
    const { username } = req.body;

    // Find user by ID and update the username
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username }, // Update username field
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ code: 404, message: 'User not found' });
    }

    // Return updated user profile details
    res.status(200).json({ code: 200, message: 'Username updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating username:', error);
    res.status(500).json({ code: 500, message: 'Internal Server Error' });
  }
}
async function fetchUserProfile(req, res) {
  try {
    // Extract user information from the token
    const token = req.headers.authorization.split(' ')[1]; // Assuming token is sent in the Authorization header
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verify and decode the token
    const userId = decodedToken.id; // Assuming the user ID is stored in the token

    // Fetch user details from the database, projecting only the required fields
    const user = await User.findById(userId).select('username email avatar');

    if (!user) {
      return res.status(404).json({ code: 404, message: 'User not found' });
    }

    // Return user profile details
    res.status(200).json({ code: 200, message: 'User profile fetched successfully', user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ code: 500, message: 'Internal Server Error' });
  }
}
async function fetchUserAvatar(req, res) {
  try {
    // Extract user information from the token
    const token = req.headers.authorization.split(' ')[1]; // Assuming token is sent in the Authorization header
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verify and decode the token
    const userId = decodedToken.id; // Assuming the user ID is stored in the token

    // Fetch user details from the database, projecting only the avatar field
    const user = await User.findById(userId).select('avatar');

    if (!user) {
      return res.status(404).json({ code: 404, message: 'User not found' });
    }

    // Return user's avatar URL
    res.status(200).json({ code: 200, message: 'User avatar fetched successfully', avatar: user.avatar });
  } catch (error) {
    console.error('Error fetching user avatar:', error);
    res.status(500).json({ code: 500, message: 'Internal Server Error' });
  }
}


  module.exports = { addUser, getUser, updateUser,deleteUser,getAllUsers,checkUsernameExists,updateUserStatus,updatePassword,updateProfile,updateUsername,fetchUserProfile,fetchUserAvatar}