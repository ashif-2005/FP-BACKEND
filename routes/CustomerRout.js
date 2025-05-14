const express = require("express");
const router = express.Router();
const {
  getAllCustomers,
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/CustomerController");

// Routes
router.get("/get-all", getAllCustomers)
router.get("/get", getCustomers);
router.post("/add", addCustomer);
router.put("/edit/:id", updateCustomer);
router.delete("/delete/:id", deleteCustomer);

module.exports = router;
