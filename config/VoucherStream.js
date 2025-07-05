const { Voucher } = require("../models/VoucherModel");
const { Log } = require("../models/LogModel");
const { Customer } = require("../models/CustomerModel");

const initVoucherStream = async () => {
  const changeStream = Voucher.watch([{ $match: { operationType: "insert" } }]);

  changeStream.on("change", async (change) => {
    const voucher = change.fullDocument;
    try {
      const company = await Customer.findOne({ name: voucher.partyCompany });
      const logData = {
        logNum: (await Log.countDocuments()) + 1,
        logDate: voucher.voucherDate,
        partyCompany: voucher.partyCompany || "Unknown Company",
        refNum: voucher.voucherNum,
        logType: "VOUCHER",
        paymentMode: voucher.paymentMode,
        bank: voucher.bank,
        chequeNum: voucher.chequeNum,
        amount: 0,
        payment: voucher.amount,
        balance: parseFloat(company.balance - voucher.amount).toFixed(2),
      };

      await Customer.findOneAndUpdate(
        { name: voucher.partyCompany },
        {
          balance: company.balance - voucher.amount,
        }
      );
      await Log.create(logData);
    } catch (error) {
      console.error(
        `Error creating log for invoice ${change.fullDocument?.invoiceNum}: ${error.message}`
      );
    }
  });

  changeStream.on("error", (error) => {
    console.error(`Invoice stream error: ${error.message}`);
  });

  changeStream.on("close", () => {
    console.log("Invoice change stream closed.");
  });
};

module.exports = initVoucherStream;
