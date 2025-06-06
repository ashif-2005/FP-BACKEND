const { Item } = require("../models/ItemModel");

// Get all items
const getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error });
  }
};

// Add a new item
const addItem = async (req, res) => {
  try {
    const { item, hsn, type, price } = req.body;

    const newItem = new Item({
      item,
      hsn,
      type,
      price,
    });

    await newItem.save();
    res.status(201).json({ message: "Item added successfully", newItem });
  } catch (error) {
    res.status(500).json({ message: "Error adding item", error });
  }
};

// Update an item
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedItems = await Item.findByIdAndUpdate(id, updatedData);
    console.log(updatedItems)

    if (!updatedItems) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item updated successfully", updatedItems});
  } catch (error) {
    res.status(500).json({ message: "Error updating item", error });
  }
};

// Delete an item
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error });
  }
};

module.exports = { getItems, addItem, updateItem, deleteItem };
