const AffiliateConversionTable = ({ conversions }) => {
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
            Recent Conversions
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Latest conversion activity.
          </p>
        </div>

        <div
          className="
            px-3 py-1 rounded-full
            bg-indigo-50
            text-indigo-700
            text-xs font-semibold
          "
        >
          {conversions.length} Records
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Offer
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Revenue
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Payout
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {conversions.map((item) => (
              <tr
                key={item._id}
                className="
                  border-b border-gray-100
                  hover:bg-gray-50
                  transition
                "
              >
                <td className="px-6 py-5 font-semibold text-gray-900">
                  {item.offer?.title}
                </td>

                <td className="px-6 py-5">
                  <span className="font-semibold text-green-600">
                    ₹{item.revenue}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <span className="font-semibold text-indigo-600">
                    ₹{item.payout}
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
        {conversions.map((item) => (
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
                <h3 className="font-semibold text-gray-900">
                  {item.offer?.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Revenue</p>

                <p className="font-bold text-green-600">
                  ₹{item.amount}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">Payout</span>

              <span className="font-semibold text-indigo-600">
                ₹{item.payout}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AffiliateConversionTable;