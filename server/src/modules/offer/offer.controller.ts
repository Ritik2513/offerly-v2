import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import Offer from "./offer.model.js";

interface CreateOfferBody {
  title: string;
  category: string;
  description?: string;
  landingPageUrl: string;
  payout: number;
  status?: "active" | "paused";
}

interface OfferQuery {
  page?: string;
  limit?: string;
  search?: string;
  status?: "active" | "paused";
}

interface OfferFilter {
  title?: {
    $regex: string;
    $options: string;
  };

  status?: "active" | "paused";
}

//create offer (admin)
export const createOffer = asyncHandler(
  async (
    req: Request<{}, {}, CreateOfferBody>,
    res: Response,
  ): Promise<void> => {
    const offer = await Offer.create(req.body);

    res.status(201).json(new ApiResponse(201, offer, "Offer created"));
  },
);

//Get All Offers (Admin + affiliate)
export const getOffers = asyncHandler(
  async (
    req: Request<{}, {}, {}, OfferQuery>,
    res: Response,
  ): Promise<void> => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    const status = req.query.status;

    const skip = (page - 1) * limit;

    const filter: OfferFilter = {};

    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (status) {
      filter.status = status;
    }

    const totalOffers = await Offer.countDocuments(filter);

    const offers = await Offer.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          offers,
          pagination: {
            page,
            limit,
            totalOffers,
            totalPages: Math.ceil(totalOffers / limit),
          },
        },
        "Offers fetched successfully",
      ),
    );
  },
);

//get single offer
export const getOffer = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };

    const offer = await Offer.findById(id);

    if (!offer) {
      throw new ApiError(404, "Offer not found");
    }

    res.json(offer);
  },
);

//update offer (admin)
export const updateOffer = asyncHandler(
  async (
    req: Request<{}, {}, Partial<CreateOfferBody>>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params as { id: string };

    const offer = await Offer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!offer) {
      throw new ApiError(404, "Offer not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, offer, "Offer updated successfully"));
  },
);

// Delete offer (admin)
export const deleteOffer = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };

    const offer = await Offer.findByIdAndDelete(id);

    if (!offer) {
      throw new ApiError(404, "Offer not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Offer deleted successfully"));
  },
);
