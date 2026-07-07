import express from "express";
import {
  getAffiliates,
  getAllAffiliates,
  createAffiliate,
  toggleAffiliateStatus,
  exportAffiliate,
} from "./user.controller.js";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import {
  createAffiliateSchema,
  getAffiliatesSchema,
  toggleAffiliateStatusSchema,
} from "../../validations/user.validation.js";

const router = express.Router();

router.get(
  "/affiliates",
  protect,
  validate(getAffiliatesSchema),
  getAffiliates,
);
router.get("/", protect, validate(getAffiliatesSchema), getAllAffiliates);
router.get("/export", protect, authorize("admin"), exportAffiliate);
router.post(
  "/create",
  protect,
  authorize("admin"),
  validate(createAffiliateSchema),
  createAffiliate,
);
router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  validate(toggleAffiliateStatusSchema),
  toggleAffiliateStatus,
);

export default router;
