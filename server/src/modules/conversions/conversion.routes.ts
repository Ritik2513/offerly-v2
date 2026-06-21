import { Router } from "express";

import { getConversions, exportConversions } from "./conversion.controller.js";

import { protect, authorize } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", protect, getConversions);

router.get("/export", protect, authorize("admin"), exportConversions);

export default router;
