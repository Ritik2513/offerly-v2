import { useEffect, useState } from "react";
import API from "../api/axios";
import StatCard from "../components/StatCard";
import AnalyticsChart from "../components/AnalyticsChart";
import { useSocket } from "../context/SocketContext";
import { SOCKET_EVENTS } from "../socket/events";

import {
  Globe,
  BarChart3,
  MousePointerClick,
  Download,
  Calendar,
  Activity,
  DollarSign,
  Percent,
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClicks: 0,
    countries: 0,
    offers: 0,
    affiliates: 0,
  });

  const socket = useSocket();

  const [trendData, setTrendData] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [todayRes, countryRes, offerRes, affiliateRes, trendRes] =
          await Promise.all([
            API.get("/analytics/today"),
            API.get("/analytics/countries"),
            API.get("/analytics/offers"),
            API.get("/analytics/admin"),
            API.get("/analytics/trends"),
          ]);

        setStats({
          totalClicks: todayRes.data?.data?.total || 0,
          countries: Object.keys(countryRes.data?.data || {}).length,
          offers: Object.keys(offerRes.data?.data || {}).length,
          affiliates: Object.keys(affiliateRes.data?.data || {}).length,
        });

        setTrendData(trendRes.data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleClickTracked = (payload) => {
      console.log("Realtime Event", payload);

      setStats((prev) => ({
        ...prev,
        totalClicks: Number(prev.totalClicks) + 1,
      }));

      setTrendData((prev) => {
        const updated = [...prev];

        if (updated.length) {
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            clicks: updated[updated.length - 1].clicks + 1,
          };
        }

        return updated;
      });
    };

    socket.on(SOCKET_EVENTS.CLICK_TRACKED, handleClickTracked);

    return () => {
      socket.off(SOCKET_EVENTS.CLICK_TRACKED, handleClickTracked);
    };
  }, [socket]);

  return (
    <div className="w-full font-inter">
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">
        {/* LEFT */}
        <div>
          <h1 className="text-[32px] sm:text-[24px] leading-tight font-bold tracking-tight text-[#071437]">
            Performance overview
          </h1>

          <p className="text-[#5E6278] mt-1 text-sm sm:text-sm">
            Real-time tracking across your network.
          </p>
        </div>

        {/* RIGHT */}
        {/* <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="bg-[#EEF2F9] p-1 rounded-2xl flex items-center justify-between sm:justify-start overflow-x-auto ">
            {["24h", "7d", "30d", "90d"].map((item) => (
              <button
                key={item}
                className={`px-4 sm:px-5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  item === "30d"
                    ? "bg-white shadow-sm text-[#071437]"
                    : "text-[#5E6278] hover:text-black"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <button className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg border border-[#E5E7EB] bg-white hover:bg-gray-50 transition">
            <Calendar size={18} />
            <span className="text-xs font-medium">Custom</span>
          </button>

          <button className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-linear-to-r from-[#7C5CFC] to-[#D15BFF] text-white shadow-md hover:opacity-90 transition">
            <Download size={18} />
            <span className="text-sm font-medium">Export</span>
          </button>
        </div> */}
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 xl:grid-cols-3 gap-5">
        <StatCard
          title="Total Clicks"
          value={loading ? "..." : stats.totalClicks}
          icon={Activity}
          change="12.4%"
          positive={true}
          iconBg="bg-[#F1F1FD]"
          iconColor="text-[#7C5CFC]"
        />

        <StatCard
          title="Countries"
          value={loading ? "..." : stats.countries}
          icon={Globe}
          change="8.1%"
          positive={true}
          iconBg="bg-[#EEF6FF]"
          iconColor="text-[#3699FF]"
        />

        <StatCard
          title="Affiliates"
          value={loading ? "..." : stats.affiliates}
          prefix=""
          icon={DollarSign}
          change="14.6%"
          positive={true}
          iconBg="bg-[#E8FFF3]"
          iconColor="text-[#17C653]"
        />

        <StatCard
          title="Offers"
          value={loading ? "..." : stats.offers}
          icon={MousePointerClick}
          change="2.3%"
          positive={false}
          iconBg="bg-[#FFF8DD]"
          iconColor="text-[#F6A609]"
        />
      </div>

      <div className="mt-8">
        <AnalyticsChart data={trendData} />
      </div>
    </div>
  );
};

export default Dashboard;
