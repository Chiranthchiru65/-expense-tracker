import { createFileRoute } from "@tanstack/react-router";
import { dummyData } from "@/assets/dummyData";
import RecentTransactions from "@/components/recentTransactions/recentTransactions";
export const Route = createFileRoute("/")({
  component: DashboardHome,
});

function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600">💳</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Balance</p>
              <p className="text-xl font-bold text-gray-900">$91,100</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600">📊</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Income</p>
              <p className="text-xl font-bold text-gray-900">$98,200</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-red-600">💸</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-xl font-bold text-gray-900">$7,100</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full gap-6 min-h-[30rem]">
        <RecentTransactions
          transactions={dummyData}
          title="Recent Transactions"
        />
        <div className="bg-white rounded-lg shadow-sm border w-1/2 ">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Financial Overview
            </h2>
          </div>
          <p className="p-6">pie chart will go here</p>
        </div>
      </div>
    </div>
  );
}
