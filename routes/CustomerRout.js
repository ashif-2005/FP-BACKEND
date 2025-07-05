const express = require("express");
const router = express.Router();
const {
  getAllCustomers,
  getCustomerByName,
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/CustomerController");
const checkUser = require("../middleware/auth");

// Routes
router.get("/get-all", getAllCustomers)
router.post("/get", getCustomerByName);
router.get("/get", getCustomers);
router.post("/add", addCustomer);
router.put("/edit/:id", updateCustomer);
router.delete("/delete/:id", deleteCustomer);

module.exports = router;
