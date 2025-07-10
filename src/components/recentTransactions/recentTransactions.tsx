import React from "react";
import { ChevronRight, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

type Currency = "INR" | "USD" | "EUR";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  currency: Currency;
  paymentMode: string;
  convertedAmount?: number;
  category: string;
  icon: string;
  notes: string;
  date: string;
  createdAt: string;
}

interface RecentTransactionProps {
  transactions: Transaction[];
  title?: string;
}

const RecentTransactions: React.FC<RecentTransactionProps> = ({
  transactions,
  title = "Recent Transactions",
}) => {
  const navigate = useNavigate();
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    const suffix =
      day === 1 || day === 21 || day === 31
        ? "st"
        : day === 2 || day === 22
          ? "nd"
          : day === 3 || day === 23
            ? "rd"
            : "th";

    return `${day}${suffix} ${month} ${year}`;
  };

  const formatAmount = (amount: number, currency: Currency): string => {
    const currencySymbols: Record<Currency, string> = {
      INR: "₹",
      USD: "$",
      EUR: "€",
    };

    const symbol = currencySymbols[currency];
    return `${symbol}${amount.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border w-1/2">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>

          <Button
            className="flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium cursor-pointer"
            variant="ghost"
            onClick={() => navigate({ to: "/expense" })}
          >
            See All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-3 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                  {transaction.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm">
                    {transaction.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className="flex items-center space-x-1 bg-red-100 py-2 px-3 rounded-md">
                    <span className="text-sm font-medium text-red-600">
                      -{" "}
                      {formatAmount(
                        transaction.convertedAmount || transaction.amount,
                        transaction.currency
                      )}
                      {/* {transaction.currency} */}
                    </span>
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentTransactions;
