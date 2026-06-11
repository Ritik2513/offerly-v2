import { Inbox } from "lucide-react";

const TableEmptyState = ({
  title = "No data found",
  description = "There are no records available.",
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl py-16 px-6 text-center">
      <Inbox size={50} className="mx-auto text-gray-400 mb-4" />

      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>

      <p className="text-sm text-gray-500 mt-2">{description}</p>
    </div>
  );
};

export default TableEmptyState;
