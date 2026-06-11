import Conversion from "./conversion.model.js";
import { exportCSV } from "../../utils/csvExport.js";

export const getConversions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const search = req.query.search?.trim() || "";
    const status = req.query.status || "";

    const skip = (page - 1) * limit;

    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "affiliate",
          foreignField: "_id",
          as: "affiliate",
        },
      },
      {
        $unwind: "$affiliate",
      },
      {
        $lookup: {
          from: "offers",
          localField: "offer",
          foreignField: "_id",
          as: "offer",
        },
      },
      {
        $unwind: "$offer",
      },
      {
        $lookup: {
          from: "clicks",
          localField: "click",
          foreignField: "_id",
          as: "click",
        },
      },
      {
        $unwind: "$click",
      },
    ];

    const matchStage = {};

    // Status Filter
    if (status) {
      matchStage.status = status;
    }

    // Search Filter
    if (search) {
      matchStage.$or = [
        {
          "affiliate.name": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "affiliate.email": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "offer.title": {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({
        $match: matchStage,
      });
    }

    // Total Records
    const totalResult = await Conversion.aggregate([
      ...pipeline,
      {
        $count: "total",
      },
    ]);

    const totalItems = totalResult[0]?.total || 0;

    // Paginated Data
    const conversions = await Conversion.aggregate([
      ...pipeline,
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    const analyticsResult = await Conversion.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          revenue: { $sum: "$revenue" },
        },
      },
    ]);

    let approved = 0;
    let pending = 0;
    let rejected = 0;
    let totalRevenue = 0;

    analyticsResult.forEach((item) => {
      if (item._id === "approved") {
        approved = item.count;
        totalRevenue += item.revenue;
      }

      if (item._id === "pending") {
        pending = item.count;
      }

      if (item._id === "rejected") {
        rejected = item.count;
      }
    });

    const analytics = {
      approved,
      pending,
      rejected,
      totalRevenue,
    };

    res.status(200).json({
      success: true,
      data: conversions,
      analytics,
      pagination: {
        page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch conversions",
    });
  }
};

export const exportConversions = async (req, res) => {
  try {
    const conversions = await Conversion.find()
      .populate("affiliate", "name")
      .populate("offer", "title")
      .lean();

    const data = conversions.map((item) => ({
      affiliate: item.affiliate?.name,
      offer: item.offer?.title,
      revenue: item.revenue,
      payout: item.payout,
      status: item.status,
      date: item.createdAt.toLocaleDateString("en-IN"),
    }));

    return exportCSV(
      res,
      data,
      ["affiliate", "offer", "revenue", "payout", "status", "date"],
      "conversions",
    );
  } catch (error) {
    return res.status(500).json({
      message: "Failed to export conversions",
    });
  }
};
