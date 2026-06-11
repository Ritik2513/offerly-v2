import { ArrowUpRight, ArrowDownRight } from "lucide-react";
const StatCard = ({
  title,
  value,
  icon: Icon,
  change,
  positive = true,
  prefix = "",
  suffix = "",
  iconBg = "bg-violet-50",
  iconColor = "text-violet-500",
}) => {
  return (
    <div className="group bg-white border border-gray-200 rounded-[22px] p-5 xl:p-6 flex flex-col justify-between gap-4 min-h-46.25 xl:min-h-30 hover:shadow-lg hover:shadow-gray-100 transition-shadow duration-300">
      
      {/* ── TOP: label + icon ── */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-[12px] font-semibold uppercase  text-gray-400 pt-0.5">
          {title}
        </p>

        <span
          className={`
            shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center
            ${iconBg} ${iconColor}
          `}
        >
          <Icon size={19} strokeWidth={1.8} />
        </span>
      </div>

      {/* ── MIDDLE: value ── */}
      <div className="flex items-end gap-0.5 leading-none">
        {prefix && (
          <span className="text-xl font-medium text-gray-400 mb-1">
            {prefix}
          </span>
        )}

        <span className="text-[38px] xl:text-[32px] font-bold tracking-tight text-[#071437]">
          {value}
        </span>

        {suffix && (
          <span className="text-lg font-medium text-gray-400 mb-1">
            {suffix}
          </span>
        )}
      </div>

      {/* ── BOTTOM: change badge ── */}
      <div className="flex items-center gap-2">
        <span
          className={`
            flex items-center gap-0.5 px-2 py-1 rounded-full
            text-xs font-semibold
            ${positive
              ? "bg-emerald-50 text-emerald-500"
              : "bg-rose-50 text-rose-500"
            }
          `}
        >
          {positive
            ? <ArrowUpRight size={13} strokeWidth={2.5} />
            : <ArrowDownRight size={13} strokeWidth={2.5} />
          }
          {change}
        </span>

        <span className="text-xs text-gray-400">vs last period</span>
      </div>
    </div>
  );
};

export default StatCard;