import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../modules/user/user.model.js";

export const protect = asyncHandler(async (req, resizeBy, next) => {
  let token;

  token = req.cookies?.token;

  if (!token)
    throw new ApiError(
      401,
      "Not authorized, no token",
      "Error from middleware/auth.middleware.js",
    );

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  //Get User from DB
  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError(401, "User not found");

  // User Disabled
  if (!user.isActive) {
    res.clearCookie("token");
    throw new ApiError(401, "Account disabled by admin");
  }

  req.user = user;

  next();
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        "Forbidden: insufficient permissions",
        "Error from middleware/auth.middleware.js",
      );
    }
    next();
  };
};
