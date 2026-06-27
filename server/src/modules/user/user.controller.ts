import { Request, Response } from "express";
import { exportCSV } from "../../utils/csvExport.js";

import {
  createAffiliatePrisma,
  getAffiliatesPrisma,
  getAllAffiliatesPrisma,
  toggleAffiliateStatusPrisma,
} from "./user.prisma.service.js";

import prisma from "../../config/prisma.js";

interface UserQuery {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
}

/*
====================================
CREATE AFFILIATE
====================================
*/
export const createAffiliate = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const user = await createAffiliatePrisma(name, email, password);

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create affiliate",
    });
  }
};

/*
====================================
GET AFFILIATES
====================================
*/

export const getAffiliates = async (req: Request, res: Response) => {
  try {
    const users = await getAffiliatesPrisma();

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

/*
====================================
GET ALL AFFILIATES
====================================
*/

export const getAllAffiliates = async (req: Request, res: Response) => {
  try {
    const result = await getAllAffiliatesPrisma({
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      search: req.query.search as string,
      status: req.query.status as string,
    });

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch affiliates",
    });
  }
};

/*
====================================
TOGGLE AFFILIATE STATUS
====================================
*/

export const toggleAffiliateStatus = async (req: Request, res: Response) => {
  try {
    const user = await toggleAffiliateStatusPrisma(req.params.id as string);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update affiliate",
    });
  }
};

/*
====================================
EXPORT AFFILIATES CSV
====================================
*/

export const exportAffiliate = async (req: Request, res: Response) => {
  try {
    const affiliates = await prisma.user.findMany({
      where: {
        role: "affiliate",
      },
    });

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
    return res.status(500).json({
      message: "Failed to export affiliates",
    });
  }
};
