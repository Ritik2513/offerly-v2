import { Document, Types } from "mongoose";

export interface IClick extends Document {
  clickId: string;
  trackingLink: Types.ObjectId;
  affiliate: Types.ObjectId;
  offer: Types.ObjectId;

  ip: string;
  country: string;
  city: string;

  device: string;
  browser: string;
  os: string;

  referer: string;
  isConverted: boolean;

  createdAt: Date;
  updatedAt: Date;
}
