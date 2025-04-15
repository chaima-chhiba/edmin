const express = require("express");
const router = express.Router();
const authControllers = require("../../controllers/authController");
const verifyToken = require("../../middleware/verifyToken");

router.post("/login", authControllers.login);

// Route for initiating the password recovery process
router.post("/password-reset-initiate", authControllers.PasswordReset);

// Route for completing the password reset process
router.post("/password-reset-complete", authControllers.completePasswordReset);

router.post("/verify-auth", verifyToken, authControllers.verify);

module.exports = router;
