import * as React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface BalanceItem {
  name: string;
  amount: number;
  icon?: string;
}

interface CustomPieChartProps {
  data: BalanceItem[];
  label: string;
  totalAmount: number;
  colors: string[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <div className="flex items-center gap-2">
          {data.icon && <span className="text-lg">{data.icon}</span>}
          <p className="font-medium">{data.name}</p>
        </div>
        <p className="text-sm text-gray-600">
          ₹{new Intl.NumberFormat("en-IN").format(data.amount)}
        </p>
        <p className="text-xs text-gray-500">
          {((data.amount / payload[0].payload.totalAmount) * 100).toFixed(1)}%
          of total
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = (props: any) => {
  const { payload } = props;

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4 px-4">
      {payload.map((entry: any, index: number) => (
        <div
          key={`legend-${index}`}
          className="flex items-center gap-1 text-xs"
        >
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />

          <span className="text-gray-600 max-w-[80px] truncate">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const CustomPieChart: React.FunctionComponent<CustomPieChartProps> = ({
  data,
  totalAmount,
  colors,
}) => {
  const dataWithTotal = data.map((item) => ({
    ...item,
    totalAmount,
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataWithTotal}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={90}
            innerRadius={60}
            labelLine={false}
            label={({ percent }) =>
              percent !== undefined && percent > 0.05
                ? `${(percent * 100).toFixed(0)}%`
                : ""
            }
          >
            {dataWithTotal.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomPieChart;
