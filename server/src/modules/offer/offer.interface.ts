import { HydratedDocument } from "mongoose";

export type OfferStatus = "active" | "paused";

export interface IOffer {
  title: string;
  category: string;
  description?: string;
  landingPageUrl: string;
  payout: number;
  status: OfferStatus;
}


export type offerDocument = HydratedDocument<IOffer>