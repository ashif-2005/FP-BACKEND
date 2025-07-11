const db = require("mongoose");

const schema = new db.Schema(
  {
    name: {
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
    gstin: {
      type: String,
      required: true,
      unique: true,
    },
    statecode: {
      type: String,
      required: true,
    },
    op_balance: {
      type: Number,
      default: 0
    },
    balance: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

const Customer = db.model("customer", schema);
module.exports = { Customer };
