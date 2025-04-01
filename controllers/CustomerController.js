const { Customer } = require("../models/CustomerModel");

// Get all customers
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error });
  }
};

// Add a new customer
const addCustomer = async (req, res) => {
  try {
    const { name, address, city, state, gstin, statecode } = req.body;

    const newCustomer = new Customer({
      name,
      address,
      city,
      state,
      gstin,
      statecode,
    });

    await newCustomer.save();
    res
      .status(201)
      .json({ message: "Customer added successfully", newCustomer });
  } catch (error) {
    res.status(500).json({ message: "Error adding customer", error });
  }
};

// Update a customer
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res
      .status(200)
      .json({ message: "Customer updated successfully", updatedCustomer });
  } catch (error) {
    res.status(500).json({ message: "Error updating customer", error });
  }
};

// Delete a customer
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting customer", error });
  }
};

module.exports = { getCustomers, addCustomer, updateCustomer, deleteCustomer };
