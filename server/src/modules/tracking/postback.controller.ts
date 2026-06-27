import { Request, Response } from "express";
import logger from "../../config/logger.js";

import { processPostbackPrisma } from "./postback.prisma.service.js";

interface PostbackQuery {
  clickId?: string;
  amount?: string;
}

export const postbackConversion = async (
  req: Request<{}, {}, {}, PostbackQuery>,
  res: Response,
): Promise<void> => {
  try {
    const { clickId, amount } = req.query;

    if (!clickId) {
      res.status(400).json({
        message: "Missing clickId",
      });
      return;
    }

    await processPostbackPrisma(clickId, amount ? Number(amount) : undefined);

    res.send("OK");
  } catch (error: any) {
    logger.error(error);

    if (error.message === "Already converted") {
      res.status(200).json({
        message: "Already converted",
      });
      return;
    }

    res.status(500).json({
      message: error.message || "Error",
    });
  }
};
