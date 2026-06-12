import redisQueueConnection from "../../config/redisQueue.js";
import TrackingLink from "../tracking/trackingLink.model.js";
import Click from "../tracking/click.model.js";
import Conversion from "../conversions/conversion.model.js";
import Payout from "../payouts/payout.model.js";
import logger from "../../config/logger.js";

//get /api/analytics/today
export const getTodayStats = async (req, res) => {
  try {
    const date = new Date().toISOString().slice(0, 10);

    const stats = await redisQueueConnection.hgetall(`stats:click:${date}`);

    res.json({
      success: true,
      data: stats || {},
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};

//GET /api/analytics/countries
export const getCountryStats = async (req, res) => {
  try {
    const keys = await redisQueueConnection.keys("stats:country:*");

    const result = {};

    for (const key of keys) {
      const country = key.split(":")[2];
      const clicks = await redisQueueConnection.hget(key, "clicks");
      result[country] = clicks;
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ message: "Error fetching country stats" });
  }
};

// GET /api/analytics/offers
export const getOfferStats = async (req, res) => {
  try {
    const keys = await redisQueueConnection.keys("stats:offer:*");

    const result = {};

    for (const key of keys) {
      const offerId = key.split(":")[2];
      const clicks = await redisQueueConnection.hget(key, "clicks");
      result[offerId] = clicks;
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ message: "Error fetching offer stats" });
  }
};

//Get /api/analytics/affiliates
export const getAdminAnalytics = async (req, res) => {
  try {
    const keys = await redisQueueConnection.keys("stats:affiliate:*");
    const result = {};

    for (const key of keys) {
      const affId = key.split(":")[2];
      const clicks = await redisQueueConnection.hget(key, "clicks");
      result[affId] = clicks;
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ message: "Error fetching affiliate stats" });
  }
};

export const getClickTrends = async (req, res) => {
  try {
    const trendData = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const date = d.toISOString().slice(0, 10);
      const total =
        (await redisQueueConnection.hget(`stats:click:${date}`, "total")) || 0;

      trendData.push({
        date: date.slice(5),
        clicks: Number(total),
      });
    }

    res.json({
      success: true,
      data: trendData,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching trends" });
  }
};

//get affiliate analytics
export const getAffiliateAnalytics = async (req, res) => {
  try {
    const affiliateId = req.user._id;

    // tracking links
    const links = await TrackingLink.find({
      affiliate: affiliateId,
    });

    const linkIds = links.map((l) => l._id);

    // clicks
    const totalClicks = await Click.countDocuments({
      trackingLink: {
        $in: linkIds,
      },
    });

    // conversions
    const conversions = await Conversion.find({
      affiliate: affiliateId,
    });

    const totalConversions = conversions.length;

    // revenue
    const totalRevenue = conversions.reduce(
      (acc, curr) => acc + curr.revenue,
      0,
    );

    // payout
    const totalPayout = conversions.reduce((acc, curr) => acc + curr.payout, 0);

    // conversion rate
    const conversionRate =
      totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : 0;

    // recent conversions
    const recentConversions = await Conversion.find({
      affiliate: affiliateId,
    })
      .populate("offer", "title")
      .sort({
        createdAt: -1,
      })
      .limit(5);

    // payouts
    const payouts = await Payout.find({
      affiliate: affiliateId,
    }).sort({
      createdAt: -1,
    });

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
