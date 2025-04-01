const db = require("mongoose");

const schema = new db.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    item: {
      type: String,
      required: true,
    },
    hsn: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Item = db.model("item", schema);
module.exports = { Item };
