import jwt from "jsonwebtoken";
import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import User from "../user/user.model.js";

export const protect = asyncHandler(async (req, res, next) => {
  console.log("==== AUTH DEBUG ====");
  console.log("Cookies:", req.cookies);
  console.log("Token:", req.cookies?.token);
  console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

  const token = req.cookies?.token;

  if (!token) {
    console.log("NO TOKEN FOUND");
    throw new ApiError(401, "Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded);

    req.user = await User.findById(decoded.id).select("-password");

    console.log("User Found:", req.user?._id);

    if (!req.user) {
      throw new ApiError(401, "User no longer exists");
    }

    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    throw new ApiError(401, err.message);
  }
});
