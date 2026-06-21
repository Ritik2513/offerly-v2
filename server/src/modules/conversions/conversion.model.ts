import mongoose, { Schema } from "mongoose";
import { IConversion } from "./conversion.interface.js";

const conversionSchema = new Schema<IConversion>(
  {
    click: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Click",
      required: true,
      index: true,
    },

    trackingLink: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrackingLink",
      required: true,
      index: true,
    },

    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
      required: true,
      index: true,
    },

    affiliate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    revenue: {
      type: Number,
      required: true,
    },

    payout: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },

    payoutStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  { timestamps: true },
);

conversionSchema.index({ offer: 1, createdAt: -1 });

const Conversion = mongoose.model<IConversion>("Conversion", conversionSchema);

export default Conversion;
