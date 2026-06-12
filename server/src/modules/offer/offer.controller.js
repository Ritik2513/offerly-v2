import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import Offer from "./offer.model.js";

//create offer (admin)
export const createOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.create(req.body);
  res.status(201).json(offer);
});

//Get All Offers (Admin + affiliate)
export const getOffers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const status = req.query.status;
  const skip = (page - 1) * limit;

  const filter = {};
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

  res.status(200).json({
    success: true,
    data: offers,
    pagination: {
      page,
      limit,
      totalOffers,
      totalPages: Math.ceil(totalOffers / limit),
    },
  });
});

//get single offer
export const getOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer)
    throw new ApiError(
      404,
      "Offer not found",
      "Error from modules/offer/offer.controller.js",
    );

  res.json(offer);
});

//update offer (admin)
export const updateOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!offer)
    throw new ApiError(
      404,
      "Offer not found",
      "Error from modules/offer/offer.controller.js",
    );
  res.json(offer);
});

// Delete offer (admin)
export const deleteOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findByIdAndDelete(req.params.id);
  if (!offer)
    throw new ApiError(
      404,
      "Offer not found",
      "Error from modules/offer/offer.controller.js",
    );
  res.json({ message: "Offer deleted" });
});
