const { PurchaseInvoice } = require("../models/PurchaseInvoiceModel");
const { PurchaseLog } = require("../models/PurchaseLog");
const { PurchaseParty } = require("../models/PurchasePartyModel");

const getTaxAndTotal = (inv) => {
  const total = inv.items
    .reduce(
      (sum, item) =>
        sum + ((parseFloat(item.quantity) || 0) * parseFloat(item.price) || 0),
      0
    )
    .toFixed(2);
  const tax = parseFloat(total * 0.18).toFixed(2);
  return parseFloat(
    parseFloat(total) + parseFloat(tax) + parseFloat(inv.transportCharge || 0)
  ).toFixed(2);
};

const adjustToNearestWhole = (amount) => {
  const rounded = Math.round(amount);
  const difference = (rounded - amount).toFixed(2);
  return {
    roundedTotal: rounded,
    adjustment: difference > 0 ? +difference : difference,
  };
};

const recalculateLogsAndBalance = async (companyName) => {
  const company = await PurchaseParty.findOne({name : companyName})
  const allLogs = await PurchaseLog.find({ partyCompany: companyName }).sort({
    logDate: 1,
    _id: 1,
  });

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
  await PurchaseParty.findOneAndUpdate(
    { name: companyName },
    { purchase_balance }
  );
};

const initPurchaseInvoiceStream = () => {
  const changeStream = PurchaseInvoice.watch(
    [{ $match: { operationType: { $in: ["insert", "delete", "update"] } } }],
    {
      fullDocument: "updateLookup",
      fullDocumentBeforeChange: "whenAvailable",
    }
  );

  changeStream.on("change", async (change) => {
    if (change.operationType == "insert") {
      const inv = change.fullDocument;
      try {
        const totalAmount = adjustToNearestWhole(
          getTaxAndTotal(inv)
        ).roundedTotal;
        const log = {
          logNum: (await PurchaseLog.countDocuments()) + 1,
          logDate: inv.invoiceDate,
          partyCompany: inv.toCompany || "Unknown Company",
          refNum: inv.invoiceNumber,
          logType: "BILL",
          paymentMode: "NA",
          bank: null,
          chequeNum: null,
          amount: totalAmount,
          payment: 0,
          balance: 0,
        };

        await PurchaseLog.create(log);
        await recalculateLogsAndBalance(inv.toCompany);

        console.log(
          `Invoice inserted: ${inv.invoiceNumber}, log added and balance recalculated.`
        );
      } catch (error) {
        console.error(
          `Error creating log for invoice ${inv.invoiceNumber}: ${error.message}`
        );
      }
    }

    if (change.operationType === "delete") {
      const invoice = change.fullDocumentBeforeChange;
      if (!invoice) return console.warn("Missing pre-image for delete.");

      try {
        await PurchaseLog.deleteOne({
          refNum: invoice.invoiceNumber,
          logType: "BILL",
        });
        await recalculateLogsAndBalance(invoice.toCompany);

        console.log(
          `Invoice deleted: ${invoice.invoiceNumber}, log removed and balance recalculated.`
        );
      } catch (error) {
        console.error(
          `Error deleting Invoice ${invoice.invoiceNumber}: ${error.message}`
        );
      }
    }
  });

  changeStream.on("error", (error) => {
    console.error(`Invoice stream error: ${error.message}`);
  });

  changeStream.on("close", () => {
    console.log("Invoice change stream closed.");
  });
};

module.exports = initPurchaseInvoiceStream;
