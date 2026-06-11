import {
  CheckCircle2,
  Clock3,
  XCircle,
  IndianRupee,
} from "lucide-react";

const stats = [
  {
    key: "approved",
    label: "Approved",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-600",
  },
  {
    key: "pending",
    label: "Pending",
    icon: Clock3,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: XCircle,
    color: "bg-red-100 text-red-600",
  },
  {
    key: "revenue",
    label: "Revenue",
    icon: IndianRupee,
    color: "bg-blue-100 text-blue-600",
    prefix: "₹",
  },
];

const ConversionStats = ({ analytics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.key}
            className="
              bg-white border border-gray-200
              rounded-3xl p-5 shadow-sm
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {item.label}
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  {item.prefix || ""}
                  {analytics?.[item.key] || 0}
                </h3>
              </div>

              <div
                className={`
                  w-12 h-12 rounded-2xl
                  flex items-center justify-center
                  ${item.color}
                `}
              >
                <Icon size={22} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversionStats;