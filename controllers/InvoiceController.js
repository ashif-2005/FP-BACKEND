const { Invoice } = require("../models/InvoiceModel");

// Get all invoices
const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoices", error });
  }
};

const getInvoices = async (req, res) => {
  try {
    // Convert query params to numbers, set default values if not provided
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // Get total count for metadata
    const total = await Invoice.countDocuments();

    // Fetch paginated invoices
    const invoices = await Invoice.find().skip(skip).limit(limit);

    res.status(200).json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: invoices,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoices", error });
  }
};


// Add a new invoice
const addInvoice = async (req, res) => {
  try {
    const {
      invoiceNumber,
      invoiceDate,
      poNumber,
      poDate,
      toCompany,
      address,
      city,
      state,
      gstNumber,
      stateCode,
      transport,
      place,
      transportCharge,
      items,
    } = req.body;

    const newInvoice = new Invoice({
      invoiceNumber,
      invoiceDate,
      poNumber,
      poDate,
      toCompany,
      address,
      city,
      state,
      gstNumber,
      stateCode,
      transport,
      place,
      transportCharge,
      items,
    });

    await newInvoice.save();
    res.status(201).json({ message: "Invoice added successfully", newInvoice });
  } catch (error) {
    res.status(500).json({ message: "Error adding invoice", error });
  }
};

// Update an invoice
const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedInvoice = await Invoice.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res
      .status(200)
      .json({ message: "Invoice updated successfully", updatedInvoice });
  } catch (error) {
    res.status(500).json({ message: "Error updating invoice", error });
  }
};

// Delete an invoice
const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInvoice = await Invoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting invoice", error });
  }
};

module.exports = { getAllInvoices, getInvoices, addInvoice, updateInvoice, deleteInvoice };
