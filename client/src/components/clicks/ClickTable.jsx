import ClickStatusBadge from "./ClickStatusBadge";
import { CalendarDays, MapPin } from "lucide-react";
import TableLoader from "../table/TableLoader";
import TableEmptyState from "../table/TableEmptyState";

const ClickTable = ({ clicks, loading }) => {
  if (loading) {
    return <TableLoader rows={5} cols={8} />;
  }

  if (!clicks?.length) {
    return (
      <TableEmptyState
        title="No click found"
        description="Click records will appear here."
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm font-inter">
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
                Country
              </th>
              <th className="text-left px-6 py-4 font-semibold text-gray-600">
                Device
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
            {clicks.map((click) => (
              <tr
                key={click.id}
                className="
                  border-b border-gray-100
                  hover:bg-gray-50
                  transition
                "
              >
                <td className="px-6 py-5">{click?.clickId}</td>
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
                      {click?.affiliate?.name?.charAt(0)}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        {click?.affiliate?.name}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {click?.affiliate?.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* OFFER */}
                <td className="px-6 py-5">
                  <div>
                    <p className="font-medium text-gray-900">
                      {click?.offer?.title}
                    </p>
                  </div>
                </td>

                {/* Country */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 font-semibold text-gray-900">
                    <MapPin size={16} className="text-green-600" />
                    {click.country}
                  </div>
                </td>

                <td className="px-6 py-5">{click.device}</td>

                {/* STATUS */}
                <td className="px-6 py-5">
                  <ClickStatusBadge status={click.isConverted} />
                </td>

                {/* DATE */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarDays size={15} />

                    <span>
                      {new Date(click.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="lg:hidden divide-y divide-gray-100">
        {clicks.map((click) => (
          <div
            key={click.id}
            className="
        p-4
        hover:bg-gray-50
        transition
      "
          >
            {/* HEADER */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="
              w-11 h-11
              rounded-xl
              bg-blue-100
              flex items-center justify-center
              font-bold
              text-blue-700
              shrink-0
            "
                >
                  {click?.affiliate?.name?.charAt(0)}
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {click?.affiliate?.name}
                  </h3>

                  <p className="text-xs text-gray-500 truncate">
                    {click?.affiliate?.email}
                  </p>
                </div>
              </div>

              <ClickStatusBadge status={click.isConverted} />
            </div>

            {/* OFFER */}
            <div className="mt-4">
              <p className="text-xs text-gray-400 uppercase">Offer</p>

              <p className="font-medium text-gray-900">{click?.offer?.title}</p>
            </div>

            {/* INFO GRID */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Click ID</p>

                <p className="font-medium text-gray-900 break-all">
                  {click.clickId}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Device</p>

                <p className="font-medium text-gray-900">{click.device}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Country</p>

                <p className="font-medium text-gray-900">{click.country}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Date</p>

                <p className="font-medium text-gray-900 text-sm">
                  {new Date(click.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClickTable;
