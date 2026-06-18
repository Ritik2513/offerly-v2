import mongoose,{Schema} from "mongoose";
import { IOffer } from "./offer.interface.js";

const offerSchema = new Schema<IOffer>(
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

const Offer = mongoose.model<IOffer>("Offer", offerSchema);
export default Offer;
