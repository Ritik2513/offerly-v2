import { HydratedDocument } from "mongoose";

export type UserRole = "admin" | "affiliate" | "advertiser";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<IUser>;
