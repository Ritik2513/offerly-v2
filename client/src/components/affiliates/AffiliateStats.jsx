import {
  MousePointerClick,
  TrendingUp,
  Percent,
  IndianRupee,
} from "lucide-react";

const stats = [
  {
    key: "totalClicks",
    label: "Total Clicks",
    icon: MousePointerClick,
    color: "bg-blue-50 text-blue-600",
  },

  {
    key: "totalConversions",
    label: "Conversions",
    icon: TrendingUp,
    color: "bg-violet-50 text-violet-600",
  },

  {
    key: "totalPayout",
    label: "Earnings",
    icon: IndianRupee,
    prefix: "₹",
    color: "bg-green-50 text-green-600",
  },

  {
    key: "conversionRate",
    label: "Conversion Rate",
    icon: Percent,
    suffix: "%",
    color: "bg-orange-50 text-orange-600",
  },
];

const AffiliateStats = ({ analytics }) => {
  return (
    <div
      className="
        grid grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-5 font-inter
      "
    >
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.key}
            className="
              group
              relative overflow-hidden
              bg-white
              rounded-3xl
              border border-gray-200
              p-6
              shadow-sm
              hover:shadow-lg
              hover:-translate-y-1
              transition-all duration-300
            "
          >
            {/* Glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gray-100 rounded-full blur-3xl opacity-40 group-hover:opacity-70 transition" />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {item.label}
                </p>

                <h2
                  className="
                    mt-3
                    text-3xl
                    font-bold
                    tracking-tight
                    text-gray-900
                  "
                >
                  {item.prefix || ""}
                  {analytics?.[item.key] || 0}
                  {item.suffix || ""}
                </h2>
              </div>

              <div
                className={`
                  w-14 h-14 rounded-2xl
                  flex items-center justify-center
                  ${item.color}
                `}
              >
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AffiliateStats;
