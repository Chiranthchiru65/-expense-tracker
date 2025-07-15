import { createFileRoute } from "@tanstack/react-router";
import RecentTransactions from "@/components/recentTransactions/recentTransactions";
import { useEffect, useState } from "react";
import CustomPieChart from "@/components/charts/customPieChart";
import useExpenseStore from "@/store/expenseStore";
import MonthlyCard from "@/components/monthlyCard/monthlyCard";
import { getSettings } from "@/services/settingsStorage";

export const Route = createFileRoute("/")({
  component: DashboardHome,
});
function DashboardHome() {
  const { expenses, fetchExpenses } = useExpenseStore();
  const [settings, setSettings] = useState(getSettings());

  const monthlyIncome = settings.monthlyIncome;
  const monthlyBudget = settings.monthlyBudget;

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === currentMonth.getMonth() &&
      expenseDate.getFullYear() === currentMonth.getFullYear()
    );
  });
  // const monthlyIncome = 50000;
  // const monthlyBudget = 15000;

  useEffect(() => {
    const handleSettingsChange = () => {
      setSettings(getSettings());
    };

    window.addEventListener("settingsChanged", handleSettingsChange);

    return () =>
      window.removeEventListener("settingsChanged", handleSettingsChange);
  }, []);

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
        const amount = expense.amount;
        return total + amount;
      }, 0);
  };

  const calculateCategoryExpenses = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const categoryTotals = expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce(
        (acc, expense) => {
          const amount = expense.amount;
          const category = expense.category;

          if (!acc[category]) {
            acc[category] = {
              name: category,
              amount: 0,
              icon: expense.icon,
            };
          }
          acc[category].amount += amount;
          return acc;
        },
        {} as Record<string, { name: string; amount: number; icon: string }>
      );

    return Object.values(categoryTotals)
      .sort((a, b) => b.amount - a.amount)
      .filter((category) => category.amount > 0);
  };

  const monthlyExpense = calculateMonthlyExpense();
  const categoryExpenses = calculateCategoryExpenses();

  const CATEGORY_COLORS = [
    "#875CF5",
    "#FA2C37",
    "#FF6900",
    "#00C896",
    "#FFB800",
    "#FF5722",
    "#9C27B0",
    "#2196F3",
    "#4CAF50",
    "#FFC107",
    "#795548",
    "#607D8B",
  ];

  const balanceData = [
    { name: "Monthly Income", amount: monthlyIncome, icon: "📊" },
    { name: "Monthly Budget", amount: monthlyBudget, icon: "💹" },
    { name: "Monthly Expense", amount: monthlyExpense, icon: "💸" },
    // { name: "Monthly Balance", amount: monthlyBalance, icon: "💳" },
  ];

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {balanceData.map((card, i) => (
            <MonthlyCard
              key={i}
              id={i}
              name={card.name}
              amount={card.amount}
              icon={card.icon}
            />
          ))}
        </div>
        {monthlyExpense > monthlyBudget && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-red-600 text-xl">⚠️</span>
              <div>
                <h3 className="text-red-800 font-semibold">Budget Exceeded!</h3>
                <p className="text-red-600 text-sm">
                  You've exceeded your monthly budget by ₹
                  {new Intl.NumberFormat("en-IN").format(
                    monthlyExpense - monthlyBudget
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex w-full gap-4 max-h-[30rem]">
          <RecentTransactions
            transactions={filteredExpenses}
            title="Recent Transactions"
          />

          <div className="bg-white rounded-lg shadow-sm border w-1/2">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Monthly Expenses by Category
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Total: ₹{new Intl.NumberFormat("en-IN").format(monthlyExpense)}
              </p>
            </div>

            {categoryExpenses.length > 0 ? (
              <CustomPieChart
                data={categoryExpenses}
                label="Category Expenses"
                totalAmount={monthlyExpense}
                colors={CATEGORY_COLORS}
              />
            ) : (
              <div className="flex items-center justify-center h-80 text-gray-500">
                <div className="text-center">
                  <span className="text-4xl mb-2 block">📊</span>
                  <p>No expenses this month</p>
                  <p className="text-sm">
                    Add some expenses to see the breakdown
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
