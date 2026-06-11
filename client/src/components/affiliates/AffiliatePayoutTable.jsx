const AffiliatePayoutTable = ({ payouts }) => {
  return (
    <div
      className="
        bg-white rounded-3xl
        border border-gray-200
        overflow-hidden
        shadow-sm
      "
    >
      {/* HEADER */}
      <div
        className="
          px-6 py-5
          border-b border-gray-100
          flex items-center justify-between
        "
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Payout History
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Recent payout transactions.
          </p>
        </div>

        <div
          className="
            px-3 py-1 rounded-full
            bg-green-50
            text-green-700
            text-xs font-semibold
          "
        >
          {payouts.length} Payouts
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Amount
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {payouts.map((item) => (
              <tr
                key={item._id}
                className="
                  border-b border-gray-100
                  hover:bg-gray-50
                  transition
                "
              >
                <td className="px-6 py-5">
                  <span className="font-bold text-green-600">
                    ₹{item.amount}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`
                      inline-flex items-center gap-2
                      px-3 py-1 rounded-full
                      text-xs font-semibold
                      ${
                        item.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    `}
                  >
                    <span
                      className={`
                        w-2 h-2 rounded-full
                        ${
                          item.status === "paid"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }
                      `}
                    />

                    {item.status}
                  </span>
                </td>

                <td className="px-6 py-5 text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden p-4 space-y-4">
        {payouts.map((item) => (
          <div
            key={item._id}
            className="
              border border-gray-200
              rounded-2xl
              p-4
              bg-gray-50/50
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Amount</p>

                <h3 className="text-xl font-bold text-green-600 mt-1">
                  ₹{item.amount}
                </h3>
              </div>

              <span
                className={`
                  inline-flex items-center gap-2
                  px-3 py-1 rounded-full
                  text-xs font-semibold
                  ${
                    item.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }
                `}
              >
                <span
                  className={`
                    w-2 h-2 rounded-full
                    ${
                      item.status === "paid"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }
                  `}
                />

                {item.status}
              </span>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              {new Date(item.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AffiliatePayoutTable;