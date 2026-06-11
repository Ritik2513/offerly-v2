import User from "../user/user.model.js";
import ApiError from "../../utils/ApiError.js";
import { generateToken } from "../../utils/jwt.js";

export const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser)
    throw new ApiError(
      400,
      "User already Exist",
      "Error from ApiError Register User",
    );

  const user = await User.create({ name, email, password, role });
  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user)
    throw new ApiError(
      404,
      "User not found",
      "Error from ApiError from Login User",
    );

  if (!user.isActive) {
    throw new ApiError(
      403,
      "Your account has been disabled",
      "Error from ApiError from Login User",
    );
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    throw new ApiError(401, "Invalid credentials", "Error from ApiError");

  return user;
};
