import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";

import { getConversions, exportConversions } from "./conversion.controller.js";

const router = express.Router();

router.get("/", protect, getConversions);
router.get("/export", protect, authorize("admin"), exportConversions);

export default router;
