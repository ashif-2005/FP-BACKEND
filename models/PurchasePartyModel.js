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
    fp_balance: {
      type: Number,
      default: 0
    },
    purchase_balance: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

const PurchaseParty = db.model("purchase-party", schema);
module.exports = { PurchaseParty };
