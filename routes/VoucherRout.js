const express = require("express");
const router = express.Router();
const {
  getAllVouchers,
  getVouchers,
  addVoucher,
  updateVoucher,
  deleteVoucher
} = require("../controllers/VoucherController");

// Routes
router.get("/get-all", getAllVouchers)
router.get("/get", getVouchers);
router.post("/add", addVoucher);
router.put("/edit/:id", updateVoucher);
router.delete("/delete/:id", deleteVoucher);

module.exports = router;
