const express = require("express");
const router = express.Router();
const {
  getItems,
  addItem,
  updateItem,
  deleteItem,
} = require("../controllers/ItemController");

// Routes
router.get("/get", getItems);
router.post("/add", addItem);
router.put("/edit/:id", updateItem);
router.delete("/delete/:id", deleteItem);

module.exports = router;
