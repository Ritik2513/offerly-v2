import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    landingPageUrl: {
      type: String,
      required: true,
    },
    payout: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "paused"],
      default: "active",
    },
  },
  { timestamps: true },
);

const Offer = mongoose.model("Offer", offerSchema);
export default Offer;
