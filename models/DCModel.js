const db = require("mongoose");

const schema = new db.Schema(
  {
    DCNum: {
      type: String,
      required: true,
    },
    DCDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    toCompany: {
      type: String,
      required: true,
    },
    ponum: {
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

const DC = db.model("dc", schema);
module.exports = { DC };
