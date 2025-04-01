const express = require("express");
const router = express.Router();
const {
  getInvoices,
  addInvoice,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/InvoiceController");

// Routes
router.get("/get", getInvoices);
router.post("/add", addInvoice);
router.put("/edit/:id", updateInvoice);
router.delete("/delete/:id", deleteInvoice);

module.exports = router;
