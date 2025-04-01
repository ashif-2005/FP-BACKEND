const { Invoice } = require("../models/InvoiceModel");

// Get all invoices
const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json(invoices);
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

module.exports = { getInvoices, addInvoice, updateInvoice, deleteInvoice };
