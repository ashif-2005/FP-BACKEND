const { Voucher } = require("../models/VoucherModel");
const { Log } = require("../models/LogModel");
const { Customer } = require("../models/CustomerModel");

const recalculateLogsAndBalance = async (companyName) => {
  const allLogs = await Log.find({ partyCompany: companyName }).sort({ logDate: 1, _id: 1 });

  let balance = 0;
  const bulkOps = allLogs.map((log, index) => {
    if (log.logType === "INVOICE") balance += log.amount;
    else if (log.logType === "VOUCHER") balance -= log.payment;

    return {
      updateOne: {
        filter: { _id: log._id },
        update: {
          $set: {
            logNum: index + 1,
            balance: parseFloat(balance.toFixed(2)),
          },
        },
      },
    };
  });

  if (bulkOps.length) await Log.bulkWrite(bulkOps);
  await Customer.findOneAndUpdate({ name: companyName }, { balance });
};

const initVoucherStream = async () => {
  const changeStream = Voucher.watch(
    [{ $match: { operationType: { $in: ["insert", "delete", "update"] } } }],
    {
      fullDocument: "updateLookup",
      fullDocumentBeforeChange: "whenAvailable",
    }
  );

  changeStream.on("change", async (change) => {
    if (change.operationType === "insert") {
      const voucher = change.fullDocument;
      try {
        const log = {
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
          balance: 0,
        };

        await Log.create(log);
        await recalculateLogsAndBalance(voucher.partyCompany);

        console.log(`Voucher inserted: ${voucher.voucherNum}, log added and balance recalculated.`);
      } catch (error) {
        console.error(`Error creating log for voucher ${voucher.voucherNum}: ${error.message}`);
      }
    }

    if (change.operationType === "delete") {
      const voucher = change.fullDocumentBeforeChange;
      if (!voucher) return console.warn("Missing pre-image for delete.");

      try {
        await Log.deleteOne({ refNum: voucher.voucherNum, logType: "VOUCHER" });
        await recalculateLogsAndBalance(voucher.partyCompany);

        console.log(`Voucher deleted: ${voucher.voucherNum}, log removed and balance recalculated.`);
      } catch (error) {
        console.error(`Error deleting voucher ${voucher.voucherNum}: ${error.message}`);
      }
    }

    if (change.operationType === "update") {
      const updated = change.fullDocument;
      const original = change.fullDocumentBeforeChange;
      if (!original) return console.warn("Missing pre-image for update.");

      try {
        await Log.findOneAndUpdate(
          { refNum: updated.voucherNum, logType: "VOUCHER" },
          {
            $set: {
              logDate: updated.voucherDate,
              paymentMode: updated.paymentMode,
              bank: updated.bank,
              chequeNum: updated.chequeNum,
              payment: updated.amount,
            },
          }
        );

        await recalculateLogsAndBalance(updated.partyCompany);

        console.log(`Voucher updated: ${updated.voucherNum}, log updated and balance recalculated.`);
      } catch (error) {
        console.error(`Error updating voucher ${updated.voucherNum}: ${error.message}`);
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