const express = require("express");
const router = express.Router();
const {
  getDCs,
  addDC,
  updateDC,
  deleteDC,
} = require("../controllers/DCController");

// Routes
router.get("/get", getDCs);
router.post("/add", addDC);
router.put("/edit/:id", updateDC);
router.delete("/delete/:id", deleteDC);

module.exports = router;
