import { CheckCircle2, Clock3, IndianRupee, Mail, User2 } from "lucide-react";
import TableLoader from "../table/TableLoader";
import TableEmptyState from "../table/TableEmptyState";

const PayoutTable = ({ payouts, loading, onMarkPaid }) => {
  if (loading) {
    return <TableLoader rows={5} cols={8} />;
  }

  if (!payouts?.length) {
    return (
      <TableEmptyState
        title="No payouts found"
        description="Payout records will appear here once generated."
      />
    );
  }

  return (
    <div
      className="
        bg-white rounded-3xl
        border border-gray-200
        shadow-sm
        overflow-hidden
        font-inter
      "
    >
      {/* TABLE HEADER */}
      <div className="px-6 py-5 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Payout History
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Review affiliate payout transactions and statuses.
            </p>
          </div>

          <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-2xl text-sm font-semibold w-fit">
            Total Records: {payouts.length}
          </div>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full min-w-212.5 text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold  tracking-wider text-gray-500">
                Affiliate
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold  tracking-wider text-gray-500">
                Amount
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold  tracking-wider text-gray-500">
                Status
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold  tracking-wider text-gray-500">
                Date
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold  tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {payouts.map((item) => (
              <tr
                key={item.id}
                className="
                  border-b border-gray-100
                  hover:bg-gray-50/80
                  transition
                "
              >
                {/* AFFILIATE */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div
                      className="
                        w-12 h-12 rounded-2xl
                        bg-indigo-100
                        flex items-center justify-center
                        shrink-0
                      "
                    >
                      <User2 size={20} className="text-indigo-600" />
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        {item.affiliate?.name}
                      </p>

                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <Mail size={14} />
                        {item.affiliate?.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* AMOUNT */}
                <td className="px-6 py-5">
                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-2xl font-semibold">
                    <IndianRupee size={16} />
                    {item.amount}
                  </div>
                </td>

                {/* STATUS */}
                <td className="px-6 py-5">
                  <span
                    className={`
                      inline-flex items-center gap-2
                      px-4 py-2 rounded-full
                      text-xs font-semibold border
                      ${
                        item.status === "paid"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-yellow-100 text-yellow-700 border-yellow-200"
                      }
                    `}
                  >
                    {item.status === "paid" ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <Clock3 size={14} />
                    )}

                    {item.status}
                  </span>
                </td>

                {/* DATE */}
                <td className="px-6 py-5 text-sm text-gray-500 font-medium">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td className="px-6 py-5">
                  <button
                    onClick={() => onMarkPaid(item.id)}
                    disabled={item.status === "paid"}
                    className={`
      px-4 py-2 rounded-xl
      text-sm font-medium
      transition

      ${
        item.status === "paid"
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
      }
    `}
                  >
                    {item.status === "paid" ? "Paid" : "Mark Paid"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="lg:hidden p-4 space-y-4">
        {payouts.map((item) => (
          <div
            key={item.id}
            className="
              border border-gray-200
              rounded-3xl
              p-5
              shadow-sm
              hover:shadow-md
              transition
              bg-white
            "
          >
            {/* TOP */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className="
                    w-12 h-12 rounded-2xl
                    bg-indigo-100
                    flex items-center justify-center
                    shrink-0
                  "
                >
                  <User2 size={20} className="text-indigo-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {item.affiliate?.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1 break-all">
                    {item.affiliate?.email}
                  </p>
                </div>
              </div>

              <span
                className={`
                  inline-flex items-center gap-1
                  px-3 py-1.5 rounded-full
                  text-[11px] font-semibold border whitespace-nowrap
                  ${
                    item.status === "paid"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-yellow-100 text-yellow-700 border-yellow-200"
                  }
                `}
              >
                {item.status === "paid" ? (
                  <CheckCircle2 size={12} />
                ) : (
                  <Clock3 size={12} />
                )}

                {item.status}
              </span>
            </div>

            {/* BOTTOM */}
            <div className="mt-5 flex items-center justify-between">
              <div>
                <p className="text-xs  tracking-wide text-gray-400 mb-1">
                  Amount
                </p>

                <div className="flex items-center gap-1 text-green-600 font-bold text-lg">
                  <IndianRupee size={18} />
                  {item.amount}
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs  tracking-wide text-gray-400 mb-1">
                  Date
                </p>

                <p className="text-sm font-medium text-gray-600">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <button
              onClick={() => onMarkPaid(item.id)}
              disabled={item.status === "paid"}
              className={`
    mt-4 w-full py-3 rounded-xl
    text-sm font-medium transition

    ${
      item.status === "paid"
        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
        : "bg-indigo-600 text-white hover:bg-indigo-700"
    }
  `}
            >
              {item.status === "paid" ? "Paid" : "Mark Paid"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PayoutTable;
