const express = require("express");
const router = express.Router();
const {
  getLogs
} = require("../controllers/LogController");

// Routes
router.post("/get", getLogs);

module.exports = router;
