// routes/api.js
const express = require("express");
const router = express.Router();

const role = require("./api/role");
const user = require("./api/user");
const client = require("./api/client");
const auth = require("./api/auth");
const hubspot = require("./api/hubspot");
const sms = require("./api/sms");
const notification = require("./api/Notifications");

router.use("/auth", auth);
router.use("/roles", role);
router.use("/", user);
router.use("/client", client);
router.use("/hubspot", hubspot);
router.use("/sms", sms);
router.use("/Notif",notification)

module.exports = router;
