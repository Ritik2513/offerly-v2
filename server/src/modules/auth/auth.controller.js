import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { registerUser, loginUser } from "./auth.service.js";
import { generateToken } from "../../utils/jwt.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  const token = generateToken(user._id);

  res
    .status(201)
    .cookie("token", token, cookieOptions)
    .json(new ApiResponse(201, { user }, "User registered"));
});

export const login = asyncHandler(async (req, res) => {
  const user = await loginUser(req.body);
  const token = generateToken(user._id);

  res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json(new ApiResponse(200, { user }, "Login successful"));
});

export const logout = asyncHandler(async (req, res) => {
  res
    .status(200)
    .clearCookie("token", cookieOptions)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};
