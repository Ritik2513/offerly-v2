import { Router } from "express";
import { generateTrackingLink, trackClick } from "./tracking.controller.js";

import { protect, authorize } from "../../middleware/auth.middleware.js";

import { postbackConversion } from "./postback.controller.js";

import validate from "../../middleware/validate.middleware.js";
import { generateTrackingSchema } from "../../validations/tracking.validation.js";

const router = Router();

router.post(
  "/generate",
  protect,
  authorize("admin", "affiliate"),
  validate(generateTrackingSchema),
  generateTrackingLink,
);

router.get("/t/:slug", trackClick);

router.get("/postback", postbackConversion);

export default router;
