import User from "../user/user.model.js";
import ApiError from "../../utils/ApiError.js";
import { UserRole, UserDocument } from "../user/user.interface.js";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const registerUser = async ({
  name,
  email,
  password,
  role,
}: RegisterPayload): Promise<UserDocument> => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create({ name, email, password, role });

  return user;
};

export const loginUser = async ({
  email,
  password,
}: LoginPayload): Promise<UserDocument> => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Account disabled");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid Credentials");
  }

  return user;
};
