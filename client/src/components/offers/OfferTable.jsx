import { Pencil, Trash2 } from "lucide-react";
import OfferStatusBadge from "./OfferStatusBadge";
import TableLoader from "../table/TableLoader";
import TableEmptyState from "../table/TableEmptyState";
import { useEffect } from "react";

const OfferTable = ({ offers, loading, onEdit, onDelete }) => {
  if (loading) {
    return <TableLoader rows={5} cols={8} />;
  }

  if (!offers.length) {
    return (
      <TableEmptyState
        title="No offers found"
        description="Create your first offer to start tracking."
      />
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden font-inter">
        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Offer
                </th>

                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Category
                </th>

                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Description
                </th>

                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Payout
                </th>

                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Status
                </th>

                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Created
                </th>

                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  URL
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {offers?.filter(Boolean).map((offer) => (
                <tr
                  key={offer.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-6 py-5">
                    <p className="font-medium text-gray-900">{offer.title}</p>
                  </td>

                  <td className="px-6 py-5 text-gray-500">
                    {offer.category || "General"}
                  </td>

                  <td className="px-6 py-5 text-gray-500 line-clamp-2 max-w-62.5">
                    {offer.description}
                  </td>

                  <td className="px-6 py-5 font-medium">₹{offer.payout}</td>

                  <td className="px-6 py-5">
                    <OfferStatusBadge status={offer.status} />
                  </td>

                  <td className="px-6 py-5 text-gray-500">
                    {new Date(offer.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-5">
                    <a
                      href={offer.landingPageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      Visit Offer
                    </a>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      {/* Edit */}
                      <button
                        onClick={() => onEdit(offer)}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition cursor-pointer"
                      >
                        <Pencil size={14} className="text-blue-600" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDelete(offer)}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition cursor-pointer"
                      >
                        <Trash2 size={14} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-gray-100">
          {offers?.filter(Boolean).map((offer) => (
            <div key={offer.id} className="p-5 hover:bg-gray-50 transition">
              {/* Top */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-base">
                    {offer.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">General</p>
                </div>

                <OfferStatusBadge status={offer.status} />
              </div>

              {/* Middle */}
              <div className="grid grid-cols-2 gap-4 mt-5">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                    Payout
                  </p>

                  <p className="font-semibold text-gray-900">${offer.payout}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                    Created
                  </p>

                  <p className="font-medium text-gray-700 text-sm">
                    {new Date(offer.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Bottom */}
              <div className="mt-5">
                <a
                  href={offer.landingPageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 rounded-xl transition"
                >
                  Visit Offer
                </a>
              </div>

              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => onEdit(offer)}
                  className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-xl hover:bg-blue-50 transition"
                >
                  <Pencil size={16} className="text-blue-600" />
                  <span className="text-sm font-medium">Edit</span>
                </button>

                <button
                  onClick={() => onDelete(offer)}
                  className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-xl hover:bg-red-50 transition"
                >
                  <Trash2 size={16} className="text-red-600" />
                  <span className="text-sm font-medium">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default OfferTable;
