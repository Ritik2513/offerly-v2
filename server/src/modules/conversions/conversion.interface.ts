import { Types } from "mongoose";

export interface IConversion {
  click: Types.ObjectId;
  trackingLink: Types.ObjectId;
  offer: Types.ObjectId;
  affiliate: Types.ObjectId;

  revenue: number;
  payout: number;

  status: "pending" | "approved" | "rejected";
  payoutStatus: "pending" | "paid";

  createdAt: Date;
  updatedAt: Date;
}
