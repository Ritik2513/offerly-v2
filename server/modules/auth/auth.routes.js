import { Router } from "express";
import { register, login, logout, getMe } from "./auth.controller.js";
import { protect } from "./auth.middleware.js";
import { authLimiter } from "../../middleware/rateLimit.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", authLimiter, login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;
