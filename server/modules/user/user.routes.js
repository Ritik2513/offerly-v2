import express from "express";
import {
  getAffiliates,
  getAllAffiliates,
  createAffiliate,
  toggleAffiliateStatus,
  exportAffiliate,
} from "./user.controller.js";
import { protect, authorize } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/affiliates", protect, getAffiliates);
router.get("/", protect, getAllAffiliates);
router.get("/export",protect, authorize("admin"), exportAffiliate);
router.post("/create", protect, createAffiliate);
router.patch("/:id/status", protect, toggleAffiliateStatus);

export default router;
