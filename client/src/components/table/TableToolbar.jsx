import { Search, Filter } from "lucide-react";

const TableToolbar = ({
  search,
  setSearch,
  status,
  setStatus,
  placeholder,
  statusOptions,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 mb-6 font-inter">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="
              absolute left-4 top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="text"
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              pl-11 pr-4 py-3
              border border-gray-200
              rounded-2xl
              text-sm
              outline-none
              transition-all
              
            "
          />
        </div>

        {/* Status Filter */}
        <div className="relative min-w-50">
          <Filter
            size={18}
            className="
              absolute left-4 top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="
              w-full
              pl-11 pr-4 py-3
              border border-gray-200
              rounded-2xl
              bg-white
              text-sm
              outline-none
              transition-all
              
            "
          >
            <option value="">All Status</option>
            {statusOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TableToolbar;
