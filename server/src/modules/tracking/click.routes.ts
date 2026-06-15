import express from "express";
import { getClicks } from "./click.controller.js";
import { protect, authorize } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), getClicks);

export default router;
