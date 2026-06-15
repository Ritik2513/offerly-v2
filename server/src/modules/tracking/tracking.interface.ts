import { Document, Types } from "mongoose";

export interface ITrackingLink extends Document {
  slug: string;
  affiliate: Types.ObjectId;
  offer: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
