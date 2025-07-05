const { Customer } = require("../models/CustomerModel");

// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error });
  }
};

// Get customer by Name
const getCustomerByName = async (req, res) => {
  try {
    const { company } = req.body;
    const customers = await Customer.findOne({name: company});
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error });
  }
};

// Get all customers in pagination
const getCustomers = async (req, res) => {
  try {
    // Convert query params to numbers, set default values if not provided
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // Get total count for metadata
    const total = await Customer.countDocuments();

    // Fetch paginated invoices
    const customers = await Customer.find().skip(skip).limit(limit);

    res.status(200).json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: customers,
    });
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

    const updatedCustomer = await Customer.findByIdAndUpdate(id, updatedData);

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

module.exports = { getAllCustomers, getCustomerByName, getCustomers, addCustomer, updateCustomer, deleteCustomer };
