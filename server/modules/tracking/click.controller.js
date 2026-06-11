import Click from "./click.model.js";

export const getClicks = async (req, res) => {
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
        $unwind: {
          path: "$affiliate",
          preserveNullAndEmptyArrays: true,
        },
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
        $unwind: {
          path: "$offer",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    const matchStage = {};

    // Search
    if (search) {
      matchStage.$or = [
        {
          clickId: {
            $regex: search,
            $options: "i",
          },
        },

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

    // Filter Converted/Pending
    if (status === "converted") {
      matchStage.isConverted = true;
    }

    if (status === "pending") {
      matchStage.isConverted = false;
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({
        $match: matchStage,
      });
    }

    // Total Records
    const totalResult = await Click.aggregate([
      ...pipeline,
      {
        $count: "total",
      },
    ]);

    const totalItems = totalResult[0]?.total || 0;

    // Paginated Data
    const clicks = await Click.aggregate([
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

    res.status(200).json({
      success: true,

      data: clicks,

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
      message: "Failed to fetch clicks",
    });
  }
};
