const express = require("express");
const router = express.Router();
const {
  getLogs
} = require("../controllers/PurchaseLogController");

// Routes
router.post("/get", getLogs);

module.exports = router;
