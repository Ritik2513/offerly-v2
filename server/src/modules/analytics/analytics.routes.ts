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

router.get("/today", getTodayStats);

router.get("/countries", getCountryStats);

router.get("/offers", getOfferStats);

router.get("/admin", getAdminAnalytics);

router.get("/trends", getClickTrends);

router.get(
  "/affiliate",
  protect,
  authorize("affiliate"),
  getAffiliateAnalytics,
);

export default router;
