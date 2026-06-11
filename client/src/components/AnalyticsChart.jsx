import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const AnalyticsChart = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Click Trends</h2>
        <p className="text-sm text-gray-500">Last 7 days tracking Activity</p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              fontSize={11}
            />
            <YAxis tickLine={false} axisLine={false} fontSize={11} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="clicks"
              stroke="#2563eb"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;
