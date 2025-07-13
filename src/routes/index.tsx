import { createFileRoute } from "@tanstack/react-router";
import RecentTransactions from "@/components/recentTransactions/recentTransactions";
import { useEffect } from "react";
import CustomPieChart from "@/components/charts/customPieChart";
import useExpenseStore from "@/store/expenseStore";
import MonthlyCard from "@/components/monthlyCard/monthlyCard";
export const Route = createFileRoute("/")({
  component: DashboardHome,
});

function DashboardHome() {
  const { expenses, fetchExpenses } = useExpenseStore();

  const monthlyIncome = 50000;
  // const monthlyBalance = 8000;
  const monthlyBudget = 15000;
  const calculateMonthlyExpense = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce((total, expense) => {
        // Use convertedAmount if available (for foreign currency), otherwise use amount
        const amount = expense.convertedAmount || expense.amount;
        return total + amount;
      }, 0);
  };

  const monthlyExpense = calculateMonthlyExpense();

  const COLORS = ["#875CF5", "#FA2C37", "#FF6900"];

  const balanceData = [
    { name: "Monthly Income", amount: monthlyIncome, icon: "📊" },
    // { name: "Monthly Balance", amount: monthlyBalance, icon: "💳" },
    { name: "Monthly Budget", amount: monthlyBudget, icon: "💹" },
    { name: "Monthly Expense", amount: monthlyExpense, icon: "💸" },
  ];

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {balanceData.map((card, i) => (
          <MonthlyCard
            id={i}
            name={card.name}
            amount={card.amount}
            icon={card.icon}
          />
        ))}
      </div>
      <div className="flex w-full gap-4 max-h-[30rem]">
        <RecentTransactions
          transactions={expenses}
          title="Recent Transactions"
        />
        <div className="bg-white rounded-lg shadow-sm border w-1/2 ">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Financial Overview
            </h2>
          </div>
          {/* <CustomPieChart
            data={balanceData}
            label="Total Balance"
            totalAmount={balance}
            colors={COLORS}
          /> */}
        </div>
      </div>
    </div>
  );
}
