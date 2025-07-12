const { Voucher } = require('../models/VoucherModel')
 
// Get all vouchers
const getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.status(200).json(vouchers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching vouchers", error: err.message });
  }
};

// Get all vouchers in pagination
const getVouchers = async (req, res) => {
  try {
    // Convert query params to numbers, set default values if not provided
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // Get total count for metadata
    const total = await Voucher.countDocuments();

    // Fetch paginated invoices
    const voucher = await Voucher.find().sort({voucherDate: 1}).skip(skip).limit(limit);

    res.status(200).json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: voucher,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error });
  }
};

// Add a new voucher
const addVoucher = async (req, res) => {
  try {
    const newVoucher = new Voucher(req.body);
    const savedVoucher = await newVoucher.save();
    res.status(201).json(savedVoucher);
  } catch (err) {
    res.status(400).json({ message: "Error adding voucher", error: err.message });
  }
};

// Edit/update an existing voucher
const updateVoucher = async (req, res) => {
  try {
    const updatedVoucher = await Voucher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedVoucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }
    res.status(200).json(updatedVoucher);
  } catch (err) {
    res.status(400).json({ message: "Error updating voucher", error: err.message });
  }
};

// Delete a voucher
const deleteVoucher = async (req, res) => {
  try {
    const deletedVoucher = await Voucher.findByIdAndDelete(req.params.id);
    if (!deletedVoucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }
    res.status(200).json({ message: "Voucher deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting voucher", error: err.message });
  }
};

module.exports = {
  getAllVouchers,
  getVouchers,
  addVoucher,
  updateVoucher,
  deleteVoucher
};
