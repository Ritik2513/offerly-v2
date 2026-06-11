import express from "express";
import { generateTrackingLink, trackClick } from "./tracking.controller.js";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import { postbackConversion } from "./postback.controller.js";

const router = express.Router();

//only affiliates generate link
router.post(
  "/generate",
  protect,
  authorize("admin", "affiliate"),
  generateTrackingLink,
);

//public route (no auth)
router.get("/t/:slug", trackClick);

// public route called by advertiser server
router.get("/postback", postbackConversion);

export default router;
