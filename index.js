const express = require("express");
const parser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const CustomerRout = require("./routes/CustomerRout");
const ItemRout = require("./routes/ItemRout");
const DCRout = require("./routes/DCRout");
const InvoiceRout = require("./routes/InvoiceRout");
const UserRout = require("./routes/UserRout");
const VoucherRout = require("./routes/VoucherRout");
const LogRout = require("./routes/LogRout");
const initInvoiceStream = require('./config/InvoiceStream')
const initVoucherStream = require('./config/VoucherStream')

const app = express();
app.use(parser.json());
app.use(cors());

dotenv.config("./env");

app.use("/user", UserRout);
app.use("/customer", CustomerRout);
app.use("/item", ItemRout);
app.use("/dc", DCRout);
app.use("/invoice", InvoiceRout);
app.use("/voucher", VoucherRout);
app.use("/log", LogRout);

initInvoiceStream();
initVoucherStream();

app.get("/test", (req, res) => {
  try {
    res.status(200).json({
      error: false,
      message: "API works successfully...",
    });
  } catch (err) {
    console.log("Error :", err);
  }
});

app.listen(process.env.PORT, async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected successful...");
    console.log(`Server is running on port ${process.env.PORT}...`);
  } catch (err) {
    console.log("Error connecting with the Database...");
    console.log("Server terminated....");
  }
});
