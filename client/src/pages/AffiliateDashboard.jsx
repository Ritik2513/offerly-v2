import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "sonner";

import AffiliateStats from "../components/affiliates/AffiliateStats";
import AffiliateConversionTable from "../components/affiliates/AffiliateConversionTable";
import AffiliatePayoutTable from "../components/affiliates/AffiliatePayoutTable";

const AffiliateDashboard = () => {
  const [analytics, setAnalytics] = useState({});
  const [recentConversions, setRecentConversions] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await API.get("/analytics/affiliate");

      setAnalytics(data.analytics || {});
      setRecentConversions(data.recentConversions || []);
      setPayouts(data.payouts || []);
    } catch (error) {
      toast.error("Failed to load affiliate dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse font-inter">
        <div className="bg-white rounded-3xl border border-gray-200 p-8">
          <div className="h-8 w-64 bg-gray-200 rounded-xl"></div>
          <div className="h-4 w-80 bg-gray-100 rounded-lg mt-4"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white rounded-3xl border border-gray-200 p-6 h-32"
            />
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 h-72" />
        <div className="bg-white rounded-3xl border border-gray-200 h-72" />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-inter">
      {/* HERO SECTION */}
      <div
        className="
          relative overflow-hidden
          rounded-4xl
          border border-indigo-200
          bg-linear-to-br from-indigo-600 via-blue-600 to-violet-600
          px-6 py-8 sm:px-8 sm:py-10
          shadow-xl
        "
      >
        {/* BACKGROUND GLOW */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

        <div className="absolute bottom-0 left-0 w-56 h-56 bg-violet-400/20 rounded-full blur-3xl" />

        <div
          className="
            relative z-10
            flex flex-col lg:flex-row
            lg:items-center lg:justify-between
            gap-8
          "
        >
          {/* LEFT */}
          <div className="max-w-2xl">
            <div
              className="
                inline-flex items-center
                px-4 py-1.5
                rounded-full
                bg-white/10
                border border-white/20
                text-xs font-medium
                text-white/90
                backdrop-blur-md
              "
            >
              Affiliate Performance Overview
            </div>

            <h1
              className="
                mt-5
                text-3xl sm:text-4xl lg:text-5xl
                font-bold
                tracking-tight
                text-white
                leading-tight
              "
            >
              Affiliate Dashboard
            </h1>

            <p
              className="
                mt-4
                text-sm sm:text-base
                text-indigo-100
                leading-relaxed
                max-w-xl
              "
            >
              Monitor your clicks, conversions, payouts and overall campaign
              performance in real-time from one centralized workspace.
            </p>
          </div>

          {/* RIGHT */}
          <div
            className="
              bg-white/10
              border border-white/20
              backdrop-blur-xl
              rounded-3xl
              px-6 py-5
              min-w-62.5
              shadow-lg
            "
          >
            <p className="text-sm text-indigo-100 font-medium">Total Revenue</p>

            <h2 className="text-4xl font-bold text-white mt-2">
              ₹{analytics?.totalPayout || 0}
            </h2>

            <div className="mt-4 flex items-center gap-2 text-sm text-green-200">
              <div className="w-2.5 h-2.5 rounded-full bg-green-300 animate-pulse" />
              Performance Updated
            </div>
          </div>
        </div>
      </div>

      {/* KPI STATS */}
      <AffiliateStats analytics={analytics} />

      {/* TABLE SECTION */}
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
        {/* CONVERSIONS */}
        <AffiliateConversionTable conversions={recentConversions} />

        {/* PAYOUTS */}
        <AffiliatePayoutTable payouts={payouts} />
      </div>
    </div>
  );
};

export default AffiliateDashboard;
