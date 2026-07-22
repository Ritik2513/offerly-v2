import { Request, Response } from "express";
import redisQueueConnection from "../../config/redisQueue.js";
import prisma from "../../config/prisma.js";
import logger from "../../config/logger.js";

/*
=========================================
GET TODAY STATS
/api/analytics/today
=========================================
*/

export const getTodayStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const tenantId = req.tenantId!;

    const date = new Date().toISOString().slice(0, 10);

    const stats = await redisQueueConnection.hgetall(
      `stats:${tenantId}:click:${date}`,
    );
    
    console.log(tenantId)

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching today's stats",
    });
  }
};

/*
=========================================
GET COUNTRY STATS
/api/analytics/countries
=========================================
*/

export const getCountryStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const tenantId = req.tenantId!;

    const keys = await redisQueueConnection.keys(`stats:${tenantId}:country:*`);

    const result: Record<string, number> = {};

    for (const key of keys) {
      const country = key.split(":")[3];

      const clicks = await redisQueueConnection.hget(key, "clicks");

      result[country] = Number(clicks || 0);
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching country stats",
    });
  }
};

/*
=========================================
GET OFFER STATS
/api/analytics/offers
=========================================
*/

export const getOfferStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const tenantId = req.tenantId!;

    const keys = await redisQueueConnection.keys(`stats:${tenantId}:offer:*`);

    const result: Record<string, number> = {};

    for (const key of keys) {
      const offerId = key.split(":")[3];

      const clicks = await redisQueueConnection.hget(key, "clicks");

      result[offerId] = Number(clicks || 0);
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching offer stats",
    });
  }
};

/*
=========================================
ADMIN ANALYTICS
/api/analytics/admin
=========================================
*/

export const getAdminAnalytics = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const tenantId = req.tenantId!;

    const keys = await redisQueueConnection.keys(
      `stats:${tenantId}:affiliate:*`,
    );

    const result: Record<string, number> = {};

    for (const key of keys) {
      const affiliateId = key.split(":")[3];

      const clicks = await redisQueueConnection.hget(key, "clicks");

      result[affiliateId] = Number(clicks || 0);
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching affiliate stats",
    });
  }
};

/*
=========================================
CLICK TRENDS
/api/analytics/trends
=========================================
*/

interface TrendData {
  date: string;
  clicks: number;
}

export const getClickTrends = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const tenantId = req.tenantId!;

    const trendData: TrendData[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();

      d.setDate(d.getDate() - i);

      const date = d.toISOString().slice(0, 10);

      const total =
        (await redisQueueConnection.hget(
          `stats:${tenantId}:click:${date}`,
          "total",
        )) || 0;

      trendData.push({
        date: date.slice(5),
        clicks: Number(total),
      });
    }

    res.status(200).json({
      success: true,
      data: trendData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching click trends",
    });
  }
};

/*
=========================================
AFFILIATE ANALYTICS
/api/analytics/affiliate
=========================================
*/

export const getAffiliateAnalytics = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const affiliateId = req.user?.id;
    const tenantId = req.tenantId!;

    if (!affiliateId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const [totalClicks, conversions, recentConversions, payouts] =
      await Promise.all([
        prisma.click.count({
          where: {
            affiliateId,
            tenantId,
          },
        }),

        prisma.conversion.findMany({
          where: {
            affiliateId,
            tenantId,
          },
        }),

        prisma.conversion.findMany({
          where: {
            affiliateId,
            tenantId,
          },

          include: {
            offer: {
              select: {
                title: true,
              },
            },
          },

          orderBy: {
            createdAt: "desc",
          },

          take: 5,
        }),

        prisma.payout.findMany({
          where: {
            affiliateId,
            tenantId,
          },

          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);

    const totalConversions = conversions.length;

    const totalRevenue = conversions.reduce(
      (sum, conversion) => sum + conversion.revenue,
      0,
    );

    const totalPayout = conversions.reduce(
      (sum, conversion) => sum + conversion.payout,
      0,
    );

    const conversionRate =
      totalClicks > 0
        ? ((totalConversions / totalClicks) * 100).toFixed(2)
        : "0.00";

    res.status(200).json({
      success: true,

      analytics: {
        totalClicks,
        totalConversions,
        totalRevenue,
        totalPayout,
        conversionRate,
      },

      recentConversions,

      payouts,
    });
  } catch (error) {
    logger.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch affiliate analytics",
    });
  }
};
