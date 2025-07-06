const db = require("mongoose");

const schema = new db.Schema(
  {
    logNum: {
      type: Number,
      required: true
    },
    logDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    partyCompany: {
      type: String,
      required: true
    },
    refNum: {
      type: String,
      required: true
    },
    logType: {
      type: String,
      enum: ["INVOICE", "VOUCHER"],
      required: true
    },
    paymentMode: {
      type: String,
      enum: ["Cheque", "NEFT/RTGS", "Cash", "NA"],
      default:"NA",
    },
    bank: {
      type: String
    },
    chequeNum: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    payment: {
        type: Number,
        default: 0
    },
    balance: {
        type: Number,
        default: 0,
        required: true
    }
  },
  {
    timestamps: true,
  }
);

const Log = db.model("log", schema);
module.exports = { Log };
