const statusStyles = {
  true: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-500",
    label: "Converted",
  },

  false: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-200",
    dot: "bg-yellow-500",
    label: "Pending",
  },
};

const ClickStatusBadge = ({ status }) => {
  const style = statusStyles[status] || statusStyles.pending;

  return (
    <div
      className={`
        inline-flex items-center gap-2
        px-3 py-1 rounded-full
        text-xs font-semibold border
        capitalize
        ${style.bg}
        ${style.text}
        ${style.border}
      `}
    >
      {/* DOT */}
      <span
        className={`
          w-2 h-2 rounded-full
          ${style.dot}
        `}
      />

      {/* STATUS */}
      <span>{style.label}</span>
    </div>
  );
};

export default ClickStatusBadge;
