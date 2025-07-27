const { PurchaseInvoice } = require("../models/PurchaseInvoiceModel");

// Get all invoices
const getAllInvoices = async (req, res) => {
  try {
    const invoices = await PurchaseInvoice.find();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoices", error });
  }
};

// Get invoice by To Company
const getInvoiceByToCompany = async (req, res) => {
  try {
    const { company } = req.body;

    // Convert query params to numbers, set default values if not provided
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // Get total count for metadata
    const total = await PurchaseInvoice.countDocuments({ toCompany: company });

    const invoices = await PurchaseInvoice.find({ toCompany: company })
      .skip(skip)
      .limit(limit);

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

const getInvoices = async (req, res) => {
  try {
    // Convert query params to numbers, set default values if not provided
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // Get total count for metadata
    const total = await PurchaseInvoice.countDocuments();

    // Fetch paginated invoices
    const invoices = await PurchaseInvoice.find().skip(skip).limit(limit);

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
      toCompany,
      gstNumber,
      items,
    } = req.body;

    const newInvoice = new PurchaseInvoice({
      invoiceNumber,
      invoiceDate,
      toCompany,
      gstNumber,
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

    const updatedInvoice = await PurchaseInvoice.findByIdAndUpdate(id, updatedData);

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
    const deletedInvoice = await PurchaseInvoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting invoice", error });
  }
};

module.exports = {
  getAllInvoices,
  getInvoiceByToCompany,
  getInvoices,
  addInvoice,
  updateInvoice,
  deleteInvoice,
};
