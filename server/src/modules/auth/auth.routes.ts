import { Router } from "express";
import { register, login, logout, getMe } from "./auth.controller.js";
import { protect } from "./auth.middleware.js";
import { authLimiter } from "../../middleware/rateLimit.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
} from "../../validations/auth.validation.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;
