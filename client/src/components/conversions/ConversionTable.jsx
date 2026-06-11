import ConversionStatusBadge from "./ConversionStatusBadge";
import { DollarSign, CalendarDays, IndianRupee } from "lucide-react";
import TableLoader from "../table/TableLoader";
import TableEmptyState from "../table/TableEmptyState";

const ConversionTable = ({ conversions, loading }) => {
  if (loading) {
    return <TableLoader rows={5} cols={8} />;
  }

  if (!conversions?.length) {
    return (
      <TableEmptyState
        title="No conversions found"
        description="Conversion records will appear here."
      />
    );
  }

  return (
    <div
      className="
        bg-white rounded-2xl
        border border-gray-200
        overflow-hidden
        shadow-sm
        font-inter
      "
    >
      {/* DESKTOP TABLE */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-gray-600">
                Click ID
              </th>
              <th className="text-left px-6 py-4 font-semibold text-gray-600">
                Affiliate
              </th>

              <th className="text-left px-6 py-4 font-semibold text-gray-600">
                Offer
              </th>

              <th className="text-left px-6 py-4 font-semibold text-gray-600">
                Payout
              </th>

              <th className="text-left px-6 py-4 font-semibold text-gray-600">
                Status
              </th>

              <th className="text-left px-6 py-4 font-semibold text-gray-600">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {conversions.map((conversion) => (
              <tr
                key={conversion._id}
                className="
                  border-b border-gray-100
                  hover:bg-gray-50
                  transition
                "
              >
                <td className="px-6 py-5">{conversion?.click?.clickId}</td>
                {/* AFFILIATE */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        w-11 h-11 rounded-2xl
                        bg-blue-100
                        flex items-center justify-center
                        text-sm font-bold text-blue-700
                      "
                    >
                      {conversion?.affiliate?.name?.charAt(0)}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        {conversion?.affiliate?.name}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {conversion?.affiliate?.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* OFFER */}
                <td className="px-6 py-5">
                  <div>
                    <p className="font-medium text-gray-900">
                      {conversion?.offer?.title}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Affiliate Campaign
                    </p>
                  </div>
                </td>

                {/* REVENUE */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 font-semibold text-gray-900">
                    <IndianRupee size={16} className="text-green-600" />
                    {conversion.payout}
                  </div>
                </td>

                {/* STATUS */}
                <td className="px-6 py-5">
                  <ConversionStatusBadge status={conversion.status} />
                </td>

                {/* DATE */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarDays size={15} />

                    <span>
                      {new Date(conversion.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      {/* MOBILE CARDS */}
      <div className="lg:hidden divide-y divide-gray-100">
        {conversions.map((conversion) => (
          <div
            key={conversion._id}
            className="
        p-4 sm:p-5
        hover:bg-gray-50
        transition
      "
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="
              shrink-0
              w-11 h-11
              rounded-xl
              bg-blue-100
              flex items-center justify-center
              text-sm font-bold text-blue-700
            "
                >
                  {conversion?.affiliate?.name?.charAt(0)}
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {conversion?.affiliate?.name}
                  </h3>

                  <p className="text-xs text-gray-500 truncate">
                    {conversion?.affiliate?.email}
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <ConversionStatusBadge status={conversion.status} />
              </div>
            </div>

            {/* Offer */}
            <div className="mt-4">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Offer
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900 wrap-break-word">
                {conversion?.offer?.title}
              </p>
            </div>

            {/* Details */}
            <div className="mt-4 space-y-3">
              {/* Click ID */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Click ID</p>

                <p className="font-medium text-gray-900 text-sm break-all">
                  {conversion?.click?.clickId}
                </p>
              </div>

              {/* Revenue + Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Payout</p>

                  <div className="flex items-center gap-1">
                    <IndianRupee size={14} className="text-green-600" />

                    <span className="font-semibold text-gray-900">
                      {conversion.payout}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Date</p>

                  <div className="flex items-center gap-1 text-gray-700">
                    <CalendarDays size={14} />

                    <span className="text-sm font-medium">
                      {new Date(conversion.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversionTable;
