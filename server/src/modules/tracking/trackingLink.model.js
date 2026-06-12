import mongoose from "mongoose";

const trackingLinkSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      index: true,
    },

    affiliate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
      required: true,
    },
  },
  { timestamps: true },
);

const TrackingLink = mongoose.model("TrackingLink", trackingLinkSchema);
export default TrackingLink;
