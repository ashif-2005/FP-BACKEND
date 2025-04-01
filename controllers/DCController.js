const { DC } = require("../models/DCModel");

// Get all DC entries
const getDCs = async (req, res) => {
  try {
    const dcs = await DC.find();
    res.status(200).json(dcs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching DC entries", error });
  }
};

// Add a new DC entry
const addDC = async (req, res) => {
  try {
    const { DCNum, DCDate, toCompany, ponum, items } = req.body;

    const newDC = new DC({
      DCNum,
      DCDate,
      toCompany,
      ponum,
      items,
    });

    await newDC.save();
    res.status(201).json({ message: "DC entry added successfully", newDC });
  } catch (error) {
    res.status(500).json({ message: "Error adding DC entry", error });
  }
};

// Update a DC entry
const updateDC = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedDC = await DC.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedDC) {
      return res.status(404).json({ message: "DC entry not found" });
    }

    res
      .status(200)
      .json({ message: "DC entry updated successfully", updatedDC });
  } catch (error) {
    res.status(500).json({ message: "Error updating DC entry", error });
  }
};

// Delete a DC entry
const deleteDC = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDC = await DC.findByIdAndDelete(id);

    if (!deletedDC) {
      return res.status(404).json({ message: "DC entry not found" });
    }

    res.status(200).json({ message: "DC entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting DC entry", error });
  }
};

module.exports = { getDCs, addDC, updateDC, deleteDC };
