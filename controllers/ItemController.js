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
    const { id, item, hsn, type, price } = req.body;

    const newItem = new Item({
      id,
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

    const updatedItem = await Item.findOneAndUpdate({ id }, updatedData, {
      new: true,
    });

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item updated successfully", updatedItem });
  } catch (error) {
    res.status(500).json({ message: "Error updating item", error });
  }
};

// Delete an item
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findOneAndDelete({ id });

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error });
  }
};

module.exports = { getItems, addItem, updateItem, deleteItem };
