const { Invoice } = require("../models/InvoiceModel");
const { Log } = require("../models/LogModel");
const { Customer } = require("../models/CustomerModel");

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
    parseFloat(total) + parseFloat(tax) + parseFloat(inv.transportCharge)
  ).toFixed(2);
};

const initInvoiceStream = () => {
  const changeStream = Invoice.watch([{ $match: { operationType: "insert" } }]);

  changeStream.on("change", async (change) => {
    const inv = change.fullDocument;
    try {
      const company = await Customer.findOne({ name: inv.toCompany });
      const logData = {
        logNum: (await Log.countDocuments()) + 1,
        logDate: inv.invoiceDate,
        partyCompany: inv.toCompany || "Unknown Company",
        refNum: inv.invoiceNumber,
        logType: "INVOICE",
        paymentMode: "NA",
        bank: null,
        chequeNum: null,
        amount: getTaxAndTotal(inv) || 0,
        payment: 0,
        balance: parseFloat(company.balance + parseFloat(getTaxAndTotal(inv))).toFixed(2),
      };

      await Customer.findOneAndUpdate(
        { name: inv.toCompany },
        {
          balance: company.balance + parseFloat(getTaxAndTotal(inv)),
        }
      );
      await Log.create(logData);
    } catch (error) {
      console.error(
        `Error creating log for invoice ${change.fullDocument?.invoiceNumber}: ${error.message}`
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

module.exports = initInvoiceStream;
