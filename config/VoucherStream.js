const { Voucher } = require("../models/VoucherModel");
const { Log } = require("../models/LogModel");
const { Customer } = require("../models/CustomerModel");

const initVoucherStream = async () => {
  const changeStream = Voucher.watch(
    [
      { $match: { operationType: { $in: ["insert", "delete", "update"] } } }
    ],
    {
      fullDocument: "updateLookup",               
      fullDocumentBeforeChange: "whenAvailable"   
    }
  );

  changeStream.on("change", async (change) => {
    // INSERT
    if (change.operationType === "insert") {
      const voucher = change.fullDocument;

      try {
        const company = await Customer.findOne({ name: voucher.partyCompany });
        const newBalance = company.balance - voucher.amount;

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
          balance: parseFloat(newBalance).toFixed(2),
        };

        await Customer.findOneAndUpdate(
          { name: voucher.partyCompany },
          { balance: newBalance }
        );

        await Log.create(logData);
        console.log(`Voucher inserted: ${voucher.voucherNum}, balance updated, log created.`);
      } catch (error) {
        console.error(`Error creating log for voucher ${voucher.voucherNum}: ${error.message}`);
      }
    }

    // DELETE
    if (change.operationType === "delete") {
      const voucher = change.fullDocumentBeforeChange;

      if (!voucher) {
        console.warn("Pre-image not available for delete operation. Skipping...");
        return;
      }

      try {
        const company = await Customer.findOne({ name: voucher.partyCompany });
        const newBalance = company.balance + voucher.amount;

        await Customer.findOneAndUpdate(
          { name: voucher.partyCompany },
          { balance: newBalance }
        );

        await Log.deleteOne({
          refNum: voucher.voucherNum,
          logType: "VOUCHER"
        });

        console.log(`Voucher deleted: ${voucher.voucherNum}, balance restored, log deleted.`);
      } catch (error) {
        console.error(`Error handling voucher delete for ${voucher.voucherNum}: ${error.message}`);
      }
    }

    // UPDATE
    if (change.operationType === "update") {
      const updatedVoucher = change.fullDocument;
      const oldVoucher = change.fullDocumentBeforeChange;

      if (!oldVoucher) {
        console.warn(`Missing pre-image for update on voucher ${updatedVoucher.voucherNum}. Skipping update.`);
        return;
      }

      try {
        const company = await Customer.findOne({ name: updatedVoucher.partyCompany });

        const amountDifference = updatedVoucher.amount - oldVoucher.amount;
        const newBalance = company.balance - amountDifference;

        await Customer.findOneAndUpdate(
          { name: updatedVoucher.partyCompany },
          { balance: newBalance }
        );

        await Log.findOneAndUpdate(
          { refNum: updatedVoucher.voucherNum, logType: "VOUCHER" },
          {
            $set: {
              logDate: updatedVoucher.voucherDate,
              paymentMode: updatedVoucher.paymentMode,
              bank: updatedVoucher.bank,
              chequeNum: updatedVoucher.chequeNum,
              payment: updatedVoucher.amount,
              balance: parseFloat(newBalance).toFixed(2),
            }
          }
        );

        console.log(`Voucher updated: ${updatedVoucher.voucherNum}, balance adjusted, log updated.`);
      } catch (error) {
        console.error(`Error handling update for voucher ${updatedVoucher.voucherNum}: ${error.message}`);
      }
    }
  });

  changeStream.on("error", (error) => {
    console.error(`Voucher stream error: ${error.message}`);
  });

  changeStream.on("close", () => {
    console.log("Voucher change stream closed.");
  });
};

module.exports = initVoucherStream;
