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
    poNumber: {
      type: String,
      required: true,
    },
    poDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    toCompany: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    gstNumber: {
      type: String,
      required: true,
    },
    stateCode: {
      type: String,
      required: true,
    },
    transport: {
      type: String
    },
    place: {
      type: String
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

const Invoice = db.model("invoice", schema);
module.exports = { Invoice };
