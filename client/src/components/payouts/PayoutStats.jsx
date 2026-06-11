import {
  Wallet,
  Clock3,
  CircleDollarSign,
  Users,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    key: "totalPaid",
    label: "Total Paid",
    icon: Wallet,
    prefix: "₹",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    border: "from-emerald-500/10 to-emerald-100/40",
  },

  {
    key: "totalPending",
    label: "Pending Payouts",
    icon: Clock3,
    prefix: "₹",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    border: "from-amber-500/10 to-amber-100/40",
  },

  {
    key: "totalPayouts",
    label: "Total Payouts",
    icon: CircleDollarSign,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    border: "from-indigo-500/10 to-indigo-100/40",
  },

  {
    key: "uniqueAffiliates",
    label: "Affiliates Paid",
    icon: Users,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    border: "from-pink-500/10 to-pink-100/40",
  },
];

const PayoutStats = ({ analytics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-5 font-inter">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.key}
            className={`
              relative overflow-hidden
              rounded-3xl border border-gray-200
              bg-linear-to-br ${item.border}
              backdrop-blur-sm
              p-5 sm:p-6
              shadow-sm hover:shadow-xl
              transition-all duration-300
              hover:-translate-y-1
              group
            `}
          >
            {/* TOP SECTION */}
            <div className="flex items-start justify-between gap-4">
              {/* LEFT */}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">
                  {item.label}
                </p>

                <h2
                  className="
                    mt-3
                    text-3xl sm:text-[30px]
                    font-bold tracking-tight
                    text-gray-900
                    wrap-break-word
                  "
                >
                  {item.prefix || ""}
                  {analytics?.[item.key] || 0}
                </h2>
              </div>

              {/* ICON */}
              <div
                className={`
                  w-14 h-14 rounded-2xl
                  flex items-center justify-center
                  shadow-sm
                  ${item.iconBg}
                `}
              >
                <Icon
                  className={`${item.iconColor} group-hover:scale-110 transition-transform duration-300`}
                  size={24}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PayoutStats;
