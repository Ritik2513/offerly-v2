import logger from "./logger.js";
import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    logger.info("MongoDB Connected");
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`MongoDB Connection failed: ${error.message}`);
    } else {
      logger.error("MongoDB Connection Failed");
    }
    process.exit(1);
  }
};
