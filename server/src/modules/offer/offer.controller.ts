import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import {
  createOfferPrisma,
  getOffersPrisma,
  getOfferPrisma,
  updateOfferPrisma,
  deleteOfferPrisma,
} from "./offer.prisma.service.js";

interface CreateOfferBody {
  title: string;
  category: string;
  description?: string;
  landingPageUrl: string;
  payout: number;
  status?: string;
}

interface OfferQuery {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
}
//create offer (admin)
export const createOffer = asyncHandler(
  async (
    req: Request<{}, {}, CreateOfferBody>,
    res: Response,
  ): Promise<void> => {
    const offer = await createOfferPrisma(req.body);

    res.status(201).json(new ApiResponse(201, offer, "Offer created"));
  },
);

//Get All Offers (Admin + affiliate)
export const getOffers = asyncHandler(
  async (
    req: Request<{}, {}, {}, OfferQuery>,
    res: Response,
  ): Promise<void> => {
    const result = await getOffersPrisma({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: req.query.search,
      status: req.query.status,
    });

    res
      .status(200)
      .json(new ApiResponse(200, result, "Offers fetched successfully"));
  },
);

//get single offer
export const getOffer = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };

    const offer = await getOfferPrisma(id);

    res.status(200).json(new ApiResponse(200, offer, "Offer fetched"));
  },
);

//update offer (admin)
export const updateOffer = asyncHandler(
  async (
    req: Request<{}, {}, Partial<CreateOfferBody>>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params as { id: string };

    const offer = await updateOfferPrisma(id, req.body);

    res.status(200).json(new ApiResponse(200, offer, "Offer updated"));
  },
);

// Delete offer (admin)
export const deleteOffer = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };

    await deleteOfferPrisma(id);

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Offer deleted successfully"));
  },
);
