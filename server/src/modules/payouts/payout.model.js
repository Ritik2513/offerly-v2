import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema(
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

const Payout = mongoose.model("Payout", payoutSchema);
export default Payout;
