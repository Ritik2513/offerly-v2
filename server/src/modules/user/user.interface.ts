import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "affiliate" | "advertiser";
  isActive: boolean;

  comparePassword(candidatePassword: string): Promise<boolean>;
}
