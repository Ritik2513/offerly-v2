const statusStyles = {
  active: "bg-green-100 text-green-700 border-green-200",
  paused: "bg-yellow-100 text-yellow-700 border-yellow-200",
  inactive: "bg-red-100 text-red-700 border-red-200",
};

const OfferStatusBadge = ({ status }) => {
  return (
    <span
      className={`
        px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || statusStyles.inactive}
        `}
    >
      {status}
    </span>
  );
};

export default OfferStatusBadge;
