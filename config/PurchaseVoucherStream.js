const { PurchaseVoucher } = require("../models/PurchaseVoucher");
const { PurchaseLog } = require("../models/PurchaseLog");
const { PurchaseParty } = require("../models/PurchasePartyModel");

const recalculateLogsAndBalance = async (companyName) => {
  const company = await PurchaseParty.findOne({ name: companyName })
  const allLogs = await PurchaseLog.find({ partyCompany: companyName }).sort({ logDate: 1, _id: 1 });

  let purchase_balance = company.fp_balance;
  const bulkOps = allLogs.map((log, index) => {
    if (log.logType === "BILL") purchase_balance += log.amount;
    else if (log.logType === "PAYMENT") purchase_balance -= log.payment;

    return {
      updateOne: {
        filter: { _id: log._id },
        update: {
          $set: {
            logNum: index + 1,
            balance: parseFloat(purchase_balance.toFixed(2)),
          },
        },
      },
    };
  });

  if (bulkOps.length) await PurchaseLog.bulkWrite(bulkOps);
  await PurchaseParty.findOneAndUpdate({ name: companyName }, { purchase_balance });
};

const initPurchaseVoucherStream = async () => {
  const changeStream = PurchaseVoucher.watch(
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
          logNum: (await PurchaseLog.countDocuments()) + 1,
          logDate: voucher.voucherDate,
          partyCompany: voucher.partyCompany || "Unknown Company",
          refNum: voucher.voucherNum,
          logType: "PAYMENT",
          paymentMode: voucher.paymentMode,
          bank: voucher.bank,
          chequeNum: voucher.chequeNum,
          amount: 0,
          payment: voucher.amount,
          balance: 0,
        };

        await PurchaseLog.create(log);
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
        await PurchaseLog.deleteOne({ refNum: voucher.voucherNum, logType: "PAYMENT" });
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
        await PurchaseLog.findOneAndUpdate(
          { refNum: updated.voucherNum, logType: "PAYMENT" },
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

module.exports = initPurchaseVoucherStream;