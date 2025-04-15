const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      // Add any other user information you want to include in the new token
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15d' }
  );
};

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    

    // Verify token using your secret key
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    

    // Fetch user information from the database based on the decoded token
    const user = await User.findById(decoded.id);
    

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach decoded user information to the request object
    req.user = user;

    // Generate a new token
    const newToken = generateToken(user);
    

    // Attach the new token to the request object
    req.token = newToken;

    // Continue to the next middleware
    next(); // Allow access to protected routes

  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;
