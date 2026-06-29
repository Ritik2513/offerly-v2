import TableLoader from "../table/TableLoader";
import TableEmptyState from "../table/TableEmptyState";

const AffiliateTable = ({ affiliates, loading, onToggleStatus }) => {
  if (loading) {
    return <TableLoader rows={5} cols={5} />;
  }

  if (!affiliates?.length) {
    return (
      <TableEmptyState
        title="No affiliates found"
        description="Invite affiliates to start growing your network."
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* DESKTOP TABLE */}
      <div className="hidden xl:block overflow-x-auto">
        <table className="w-full min-w-225 text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4  font-semibold tracking-wide text-gray-500">
                Affiliate
              </th>

              <th className="text-left px-6 py-4 font-semibold tracking-wide text-gray-500">
                Email
              </th>

              <th className="text-left px-6 py-4  font-semibold tracking-wide text-gray-500">
                Status
              </th>

              <th className="text-left px-6 py-4 font-semibold tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {affiliates.map((affiliate) => (
              <tr
                key={affiliate.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                {/* NAME */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    {/* AVATAR */}
                    <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm uppercase">
                      {affiliate?.name?.charAt(0) || "A"}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        {affiliate.name}
                      </p>

                      <p className="text-gray-400 mt-1">Affiliate Partner</p>
                    </div>
                  </div>
                </td>

                {/* EMAIL */}
                <td className="px-6 py-5  text-gray-600">{affiliate.email}</td>

                {/* STATUS */}
                <td className="px-6 py-5">
                  <span
                    className={`
                      inline-flex items-center
                      px-3 py-1.5 rounded-full
                      font-semibold
                      ${
                        affiliate.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    `}
                  >
                    <span
                      className={`
                        w-2 h-2 rounded-full mr-2
                        ${affiliate.isActive ? "bg-green-500" : "bg-red-500"}
                      `}
                    />

                    {affiliate.isActive ? "Active" : "Disabled"}
                  </span>
                </td>

                {/* ACTION */}
                <td className="px-6 py-5">
                  <button
                    onClick={() => onToggleStatus(affiliate)}
                    className={`
                      px-5 py-2.5 rounded-xl
                      text-sm font-medium
                      transition-all duration-200
                      cursor-pointer
                      ${
                        affiliate.isActive
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      }
                    `}
                  >
                    {affiliate.isActive ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TABLET */}
      <div className="hidden md:block xl:hidden overflow-x-auto">
        <table className="w-full min-w-175">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-4  font-semibold text-gray-500 uppercase">
                Affiliate
              </th>

              <th className="text-left px-5 py-4 font-semibold text-gray-500 uppercase">
                Status
              </th>

              <th className="text-left px-5 py-4  font-semibold text-gray-500 uppercase">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {affiliates.map((affiliate) => (
              <tr key={affiliate.id} className="border-b border-gray-100">
                <td className="px-5 py-5">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {affiliate.name}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {affiliate.email}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-5">
                  <span
                    className={`
                      px-3 py-1 rounded-full
                       font-semibold
                      ${
                        affiliate.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    `}
                  >
                    {affiliate.isActive ? "Active" : "Disabled"}
                  </span>
                </td>

                <td className="px-5 py-5">
                  <button
                    onClick={() => onToggleStatus(affiliate)}
                    className={`
                      px-4 py-2 rounded-xl
                      text-sm font-medium
                      transition cursor-pointer
                      ${
                        affiliate.isActive
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      }
                    `}
                  >
                    {affiliate.isActive ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden p-4 space-y-4 bg-gray-50/40">
        {affiliates.map((affiliate) => (
          <div
            key={affiliate.id}
            className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm"
          >
            {/* TOP */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* AVATAR */}
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-semibold uppercase">
                  {affiliate?.name?.charAt(0) || "A"}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {affiliate.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1 break-all">
                    {affiliate.email}
                  </p>
                </div>
              </div>

              <span
                className={`
                  px-3 py-1 rounded-full
                  font-semibold whitespace-nowrap
                  ${
                    affiliate.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                `}
              >
                {affiliate.isActive ? "Active" : "Disabled"}
              </span>
            </div>

            {/* ACTION BUTTON */}
            <button
              onClick={() => onToggleStatus(affiliate)}
              className={`
                mt-5 w-full py-3 rounded-2xl
                text-sm font-semibold
                transition-all duration-200
                cursor-pointer
                ${
                  affiliate.isActive
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-green-50 text-green-600 hover:bg-green-100"
                }
              `}
            >
              {affiliate.isActive ? "Disable Affiliate" : "Enable Affiliate"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AffiliateTable;
