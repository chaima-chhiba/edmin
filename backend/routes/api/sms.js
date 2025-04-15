
const express = require("express");
const router = express.Router();


const { getSMShistory, addSMShistory, getAllSMShistoryEntries } = require("../../controllers/SMSController");


router.get("/", getSMShistory);
router.get("/all", getAllSMShistoryEntries);
router.post("/", addSMShistory);

module.exports = router;
