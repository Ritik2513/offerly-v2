import User from "./user.model.js";
import { exportCSV } from "../../utils/csvExport.js";

export const createAffiliate = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "affiliate",
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create Affiliate",
    });
  }
};

export const getAffiliates = async (req, res) => {
  try {
    const users = await User.find({
      role: "affiliate",
    }).select("name email");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch affiliates",
    });
  }
};

export const getAllAffiliates = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const status = req.query.status;
    const skip = (page - 1) * limit;
    const filter = {
      role: "affiliate",
    };

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (status !== undefined && status !== "") {
      filter.isActive = status === "true";
    }

    const total = await User.countDocuments(filter);

    const affiliates = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: affiliates,
      pagination: {
        page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch affiliates",
    });
  }
};

export const toggleAffiliateStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Affiliate not found" });
    }

    user.isActive = !user.isActive;

    await user.save();

    res.status(200).json({ success: true, user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update affiliate" });
  }
};

export const exportAffiliate = async (req, res) => {
  try {
    const affiliates = await User.find({ role: "affiliate" }).lean();

    const data = affiliates.map((affiliate) => ({
      name: affiliate.name,
      email: affiliate.email,
      status: affiliate.isActive ? "Active" : "Inactive",
      joined: affiliate.createdAt.toLocaleDateString("en-IN"),
    }));

    return exportCSV(
      res,
      data,
      ["name", "email", "status", "joined"],
      "affiliates",
    );
  } catch (error) {
    return res.status(500).json({ message: "Failed to export affiliates" });
  }
};
