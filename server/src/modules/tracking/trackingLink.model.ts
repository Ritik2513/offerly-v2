import mongoose, { Schema } from "mongoose";
import { ITrackingLink } from "./tracking.interface.js";

const trackingLinkSchema = new Schema<ITrackingLink>(
  {
    slug: {
      type: String,
      unique: true,
      index: true,
    },

    affiliate: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    offer: {
      type: Schema.Types.ObjectId,
      ref: "Offer",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<ITrackingLink>(
  "TrackingLink",
  trackingLinkSchema,
);
