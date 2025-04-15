// routes/clientRoutes.js
const express = require("express");
const router = express.Router();
const hubSpotController = require("../../controllers/hubSpotController");

router.get("/company/:id", hubSpotController.searchHubSpotCompany);
router.get("/search", hubSpotController.searchCompanies);
router.post("/webhook", hubSpotController.handleWebhook);



module.exports = router;
