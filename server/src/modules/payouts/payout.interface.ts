import { Types } from "mongoose";

export type PayoutStatus = "pending" | "paid";

export interface IPayout {
  affiliate: Types.ObjectId;
  amount: number;
  conversions: Types.ObjectId[];

  status: PayoutStatus;
  paidAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}