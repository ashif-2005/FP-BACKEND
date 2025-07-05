const { Log } = require("../models/LogModel");

// Get all Logs in pagination
const getLogs = async (req, res) => {
  try {
    const { company } = req.body;
    // Convert query params to numbers, set default values if not provided
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // Get total count for metadata
    const total = await Log.countDocuments({ partyCompany: company });

    // Fetch paginated invoices
    const log = await Log.find({ partyCompany: company })
      // .sort({logDate: 1})
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: log,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error });
  }
};

module.exports = {
  getLogs,
};
