import { Router } from "express";

import {
  getTodayStats,
  getCountryStats,
  getOfferStats,
  getAdminAnalytics,
  getClickTrends,
  getAffiliateAnalytics,
} from "./analytics.controller.js";

import { protect, authorize } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/today", protect, getTodayStats);

router.get("/countries", protect, getCountryStats);

router.get("/offers", protect, getOfferStats);

router.get("/admin", protect, getAdminAnalytics);

router.get("/trends", protect, getClickTrends);

router.get(
  "/affiliate",
  protect,
  authorize("affiliate"),
  getAffiliateAnalytics,
);

export default router;
