const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Role = require("../models/Role");

// login

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ message: "Invalid fields" });
    }

    const user = await User.findOne({ email }).exec();

    if (!user) {
      return res.status(401).json({ message: "Email or password is incorrect" });
    }

    // Check if user status is active
    if (!user.status) {
      return res.status(401).json({ message: "User account is inactive" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Email or password is incorrect" });
    }

    const role = await Role.findOne({ _id: user.role })
      .select("superAdmin accessList")
      .exec();

    const token = jwt.sign(
      {
        id: user.id,
        role: role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({ token, role });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


function generatePasswordResetToken(user) {
  return jwt.sign({ userId: user._id }, process.env.PASSWORD_RESET_SECRET, {
    expiresIn: "15m",
  });
}

// Function to send a password reset email with the token embedded in the reset link
async function sendPasswordResetEmail(user, token) {
  const resetLink = `${process.env.CLIENT_URL}/password-reset-link?token=${token}`;

  console.log("Reset Link:", resetLink);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Password Reset",
    html: `Click the following link to reset your password: <a href="${resetLink}">${resetLink}</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
    throw new Error("Error sending password reset email");
  }
}

async function PasswordReset(req, res) {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(422).json({ message: "Invalid email" });
    }

    const user = await User.findOne({ email }).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = generatePasswordResetToken(user);

    await sendPasswordResetEmail(user, resetToken);

    // Return the reset token along with the response
    return res.status(200).json({ resetToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function completePasswordReset(req, res) {
  const { token, newPassword, confirmPassword } = req.body;

  try {
    // Validate input
    if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
      return res.status(422).json({ message: "Invalid input" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.PASSWORD_RESET_SECRET);

    // Check if the user exists
    const user = await User.findById(decoded.userId).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password and update the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Return success response
    return res.sendStatus(200);
  } catch (error) {
    console.error("Error completing password reset:", error);

    // Handle different error scenarios
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } else if (error.name === "ValidationError") {
      return res.status(422).json({ message: error.message });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

async function verify(req, res) {
  try {
    let user = req.user;

    // Ensure the user and role exist before proceeding
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const role = await Role.findOne({ _id: user.role })
      .select("superAdmin accessList")
      .exec();

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({ token, role });
  } catch (error) {
    console.error("Verification error:", error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: "Validation Error", details: error.message });
    } else if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid ID format", details: error.message });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired", details: error.message });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token", details: error.message });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { login, verify, PasswordReset, completePasswordReset };
