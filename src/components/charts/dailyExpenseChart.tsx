// components/charts/DailyExpenseChart.tsx
import React from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import type { Expense } from "@/services/expenseServices";

interface DailyExpenseChartProps {
  expenses: Expense[];
  selectedMonth?: Date;
}

interface DailyData {
  date: string;
  amount: number;
  day: string;
  fullDate: Date;
}

const DailyExpenseChart: React.FC<DailyExpenseChartProps> = ({
  expenses,
  selectedMonth = new Date(),
}) => {
  const calculateDailyExpenses = (): DailyData[] => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dailyData: DailyData[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dateString = `${day}${getDaySuffix(day)} ${currentDate.toLocaleDateString("en-US", { month: "short" })}`;

      const dayExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getDate() === day &&
          expenseDate.getMonth() === month &&
          expenseDate.getFullYear() === year
        );
      });

      const totalAmount = dayExpenses.reduce((sum, expense) => {
        return sum + expense.amount;
      }, 0);

      dailyData.push({
        date: dateString,
        amount: totalAmount,
        day: day.toString(),
        fullDate: currentDate,
      });
    }

    return dailyData;
  };

  const getDaySuffix = (day: number): string => {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const data = calculateDailyExpenses();
  const maxAmount = Math.max(...data.map((d) => d.amount));
  const yAxisMax = maxAmount > 0 ? Math.ceil(maxAmount * 1.2) : 1000;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-blue-600">
            ₹{new Intl.NumberFormat("en-IN").format(data.amount)}
          </p>
          {data.amount === 0 && (
            <p className="text-xs text-gray-500">No expenses</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#666" }}
            interval={Math.ceil(data.length / 10)} // Show every nth tick to avoid crowding
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#666" }}
            domain={[0, yAxisMax]}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#8884d8"
            strokeWidth={3}
            fill="url(#colorAmount)"
            dot={{ fill: "#8884d8", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#8884d8", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyExpenseChart;
