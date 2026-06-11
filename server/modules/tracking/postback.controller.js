import Click from "../tracking/click.model.js";
import Conversion from "../conversions/conversion.model.js";
import TrackingLink from "../tracking/trackingLink.model.js";
import Offer from "../offer/offer.model.js";
import Payout from "../payouts/payout.model.js";
import logger from "../../config/logger.js";

export const postbackConversion = async (req, res) => {
  try {
    const { clickId, amount } = req.query;

    if (!clickId) return res.status(400).json({ message: "Missing clickId" });

    //find click
    const click = await Click.findOne({ clickId }).populate("trackingLink");

    if (!click) return res.status(404).json({ message: "Click not found" });

    if (click.isConverted)
      return res.status(200).json({ message: "Already converted" });

    //load related data
    const trackingLink = await TrackingLink.findById(
      click.trackingLink,
    ).populate("offer affiliate");

    const offer = await Offer.findById(trackingLink.offer);

    const revenue = Number(amount) || offer.payout;
    const affiliatePayout = offer.payout;

    const conversion = await Conversion.create({
      click: click._id,
      trackingLink: trackingLink._id,
      offer: offer._id,
      affiliate: trackingLink.affiliate,
      revenue,
      payout: affiliatePayout,
    });

    await Payout.create({
      affiliate: trackingLink.affiliate,
      conversions: conversion._id,
      amount: affiliatePayout,
      status: "pending",
    });

    // mark click converted
    click.isConverted = true;
    await click.save();

    res.send("OK");
  } catch (error) {
    logger.error(error);
    res.status(500).send("Error");
  }
};
