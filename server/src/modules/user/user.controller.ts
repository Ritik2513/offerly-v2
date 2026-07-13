import { Request, Response } from "express";
import { exportCSV } from "../../utils/csvExport.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import {
  createAffiliatePrisma,
  getAffiliatesPrisma,
  getAllAffiliatesPrisma,
  toggleAffiliateStatusPrisma,
} from "./user.prisma.service.js";

import prisma from "../../config/prisma.js";

/*
====================================
CREATE AFFILIATE
====================================
*/
export const createAffiliate = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const tenantId = req.tenantId;

    const user = await createAffiliatePrisma(name, email, password, tenantId!);

    res
      .status(201)
      .json(new ApiResponse(201, user, "Affiliate created successfully"));
  },
);

/*
====================================
GET AFFILIATES
====================================
*/

export const getAffiliates = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const users = await getAffiliatesPrisma(req.tenantId!);

    res
      .status(200)
      .json(new ApiResponse(200, users, "Affiliates fetched successfully"));
  },
);

/*
====================================
GET ALL AFFILIATES
====================================
*/

export const getAllAffiliates = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await getAllAffiliatesPrisma({
      tenantId: req.tenantId!,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: (req.query.search as string) || "",
      status: (req.query.status as string) || "",
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          users: result.users,
          pagination: result.pagination,
        },
        "Affiliates fetched successfully",
      ),
    );
  },
);

/*
====================================
TOGGLE AFFILIATE STATUS
====================================
*/

export const toggleAffiliateStatus = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = await toggleAffiliateStatusPrisma(
      req.params.id as string,
      req.tenantId!,
    );

    res
      .status(200)
      .json(new ApiResponse(200, user, "Affiliate status updated"));
  },
);

/*
====================================
EXPORT AFFILIATES CSV
====================================
*/

export const exportAffiliate = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const affiliates = await prisma.user.findMany({
      where: {
        role: "affiliate",
        tenantId: req.tenantId!,
      },
    });

    const data = affiliates.map((affiliate) => ({
      name: affiliate.name,
      email: affiliate.email,
      status: affiliate.isActive ? "Active" : "Inactive",
      joined: affiliate.createdAt.toLocaleDateString("en-IN"),
    }));

    exportCSV(res, data, ["name", "email", "status", "joined"], "affiliates");
  },
);
