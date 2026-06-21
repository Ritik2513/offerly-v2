import mongoose, { Schema } from "mongoose";
import { IPayout } from "./payout.interface.js";

const payoutSchema = new Schema<IPayout>(
  {
    affiliate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    conversions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversion",
      },
    ],

    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    paidAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Payout = mongoose.model<IPayout>(
  "Payout",
  payoutSchema,
);

export default Payout;