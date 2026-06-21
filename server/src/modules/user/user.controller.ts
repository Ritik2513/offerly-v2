import { Request, Response } from "express";

import User from "./user.model.js";
import { exportCSV } from "../../utils/csvExport.js";

/*
====================================
INTERFACES
====================================
*/

interface CreateAffiliateBody {
  name: string;
  email: string;
  password: string;
}

interface UserQuery {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
}

interface ExportAffiliateRow {
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
}

/*
====================================
CREATE AFFILIATE
====================================
*/

export const createAffiliate = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const body =
      req.body as CreateAffiliateBody;

    const {
      name,
      email,
      password,
    } = body;

    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message:
          "Email already exists",
      });

      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "affiliate",
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to create Affiliate",
    });
  }
};

/*
====================================
GET AFFILIATES
====================================
*/

export const getAffiliates = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const users =
      await User.find({
        role: "affiliate",
      }).select("name email");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to fetch affiliates",
    });
  }
};

/*
====================================
GET ALL AFFILIATES
====================================
*/

export const getAllAffiliates =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const query =
        req.query as UserQuery;

      const page =
        Number(query.page) || 1;

      const limit =
        Number(query.limit) || 10;

      const search =
        query.search || "";

      const status =
        query.status;

      const skip =
        (page - 1) * limit;

      const filter: any = {
        role: "affiliate",
      };

      // search filter
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

      // status filter
      if (
        status !== undefined &&
        status !== ""
      ) {
        filter.isActive =
          status === "true";
      }

      const total =
        await User.countDocuments(
          filter,
        );

      const affiliates =
        await User.find(filter)
          .select("-password")
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit);

      res.status(200).json({
        success: true,

        data: affiliates,

        pagination: {
          page,
          totalPages:
            Math.ceil(
              total / limit,
            ),

          totalItems: total,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to fetch affiliates",
      });
    }
  };

/*
====================================
TOGGLE AFFILIATE STATUS
====================================
*/

export const toggleAffiliateStatus =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { id } =
        req.params as {
          id: string;
        };

      const user =
        await User.findById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          message:
            "Affiliate not found",
        });

        return;
      }

      user.isActive =
        !user.isActive;

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to update affiliate",
      });
    }
  };

/*
====================================
EXPORT AFFILIATES CSV
====================================
*/

export const exportAffiliate =
  async (
    req: Request,
    res: Response,
  ): Promise<Response | void> => {
    try {
      const affiliates =
        (await User.find({
          role: "affiliate",
        }).lean()) as unknown as ExportAffiliateRow[];

      const data =
        affiliates.map(
          (affiliate) => ({
            name:
              affiliate.name,

            email:
              affiliate.email,

            status:
              affiliate.isActive
                ? "Active"
                : "Inactive",

            joined:
              affiliate.createdAt.toLocaleDateString(
                "en-IN",
              ),
          }),
        );

      return exportCSV(
        res,
        data,
        [
          "name",
          "email",
          "status",
          "joined",
        ],
        "affiliates",
      );
    } catch (error) {
      return res.status(500).json({
        message:
          "Failed to export affiliates",
      });
    }
  };