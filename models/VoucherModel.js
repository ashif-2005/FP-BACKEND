const db = require("mongoose");

const schema = new db.Schema(
  {
    voucherNum: {
      type: String,
      required: true
    },
    voucherDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    partyCompany: {
      type: String,
      required: true
    },
    paymentMode: {
      type: String,
      enum: ["Cheque", "NEFT/RTGS", "NA"],
      required: true
    },
    bank: {
      type: String,
      default: null
    },
    chequeNum: {
        type: String,
        default: null
    },
    amount: {
        type: Number,
        required: true
    }
  },
  {
    timestamps: true,
  }
);

const Voucher = db.model("voucher", schema);
module.exports = { Voucher };
