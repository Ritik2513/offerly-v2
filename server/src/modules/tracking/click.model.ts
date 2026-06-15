import mongoose, { Schema } from "mongoose";
import { IClick } from "./click.interface.js";

const clickSchema = new Schema<IClick>(
  {
    trackingLink: {
      type: Schema.Types.ObjectId,
      ref: "TrackingLink",
      required: true,
      index: true,
    },

    clickId: {
      type: String,
      unique: true,
      index: true,
    },

    affiliate: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    offer: {
      type: Schema.Types.ObjectId,
      ref: "Offer",
      index: true,
    },

    //attribution core
    ip: {
      type: String,
      index: true,
    },

    country: {
      type: String,
      index: true,
    },

    city: String,

    //device analytics
    device: {
      type: String,
      enum: [
        "mobile",
        "tablet",
        "desktop",
        "smarttv",
        "wearable",
        "console",
        "unknown",
      ],
      default: "desktop",
      index: true,
    },

    browser: String,
    os: String,

    referer: String,

    //conversion linkage (very important later)
    isConverted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

//compound index for analytics queries
clickSchema.index({ trackingLink: 1, createdAt: -1 });
export default mongoose.model<IClick>("Click", clickSchema);
