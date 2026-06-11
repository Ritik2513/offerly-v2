import express from "express";
import {
  createOffer,
  getOffers,
  getOffer,
  updateOffer,
  deleteOffer,
} from "./offer.controller.js";

import { protect, authorize } from "../../middleware/auth.middleware.js";

const router = express.Router();

//public for logged-in users
router.get("/", protect, getOffers);
router.get("/:id", protect, getOffer);

//admin only
router.post("/", protect, authorize("admin"), createOffer);
router.put("/:id", protect, authorize("admin"), updateOffer);
router.delete("/:id", protect, authorize("admin"), deleteOffer);

export default router;
