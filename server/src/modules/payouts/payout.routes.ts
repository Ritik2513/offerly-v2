import { Router } from "express";

import {
  createPayout,
  getPayout,
  markPayoutPaid,
  exportPayouts,
} from "./payout.controller.js";

import { protect, authorize } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", protect, getPayout);

router.get("/export", protect, authorize("admin"), exportPayouts);

router.post("/create", protect, createPayout);

router.patch("/:id/pay", protect, markPayoutPaid);

export default router;
