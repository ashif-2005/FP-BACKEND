const db = require("mongoose");

const schema = new db.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
    },
    invoiceDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    toCompany: {
      type: String,
      required: true,
    },
    gstNumber: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const PurchaseInvoice = db.model("purchase-invoice", schema);
module.exports = { PurchaseInvoice };
