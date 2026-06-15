import { Router } from "express";
import { generateTrackingLink, trackClick } from "./tracking.controller.js";

import { protect, authorize } from "../../middleware/auth.middleware.js";

import { postbackConversion } from "./postback.controller.js";

const router = Router();

router.post(
  "/generate",
  protect,
  authorize("admin", "affiliate"),
  generateTrackingLink,
);

router.get("/t/:slug", trackClick);

router.get("/postback", postbackConversion);

export default router;
