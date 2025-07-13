import { Button } from "@/components/ui/button";
import useExpenseStore from "@/store/expenseStore";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Table from "@/components/table/table";
import { useEffect } from "react";
import React from "react";
export const Route = createFileRoute("/expense")({
  component: () => <Expense />,
});
function Expense() {
  const { expenses, fetchExpenses, openAddModal } = useExpenseStore();

  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const today = new Date();

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() - 1);
      return newMonth;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + 1);
      return newMonth;
    });
  };

  const isCurrentMonth = () => {
    return (
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === currentMonth.getMonth() &&
      expenseDate.getFullYear() === currentMonth.getFullYear()
    );
  });

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return (
    <>
      <div>
        <div className="w-full bg-white rounded-lg px-4 py-3">
          <div className="flex justify-between items-center ">
            <h1 className="text-xl font-bold ">All Expenses</h1>
            <div className="flex gap-4">
              <Drawer>
                <Button>
                  <DrawerTrigger>Open</DrawerTrigger>
                </Button>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                    <DrawerDescription>
                      This action cannot be undone.
                    </DrawerDescription>
                    <DrawerDescription>
                      This action cannot be undone.
                    </DrawerDescription>
                    <DrawerDescription>
                      This action cannot be undone.
                    </DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter>
                    <Button>Submit</Button>
                    <DrawerClose>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousMonth}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="px-4 py-2 bg-gray-100 rounded-md min-w-[140px] text-center">
                    <span className="font-medium text-gray-900">
                      {currentMonth.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextMonth}
                    disabled={isCurrentMonth()}
                    className="h-8 w-8 p-0 disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button variant="outline" onClick={() => {}}>
                <span>
                  <Download />
                </span>
                Download
              </Button>
            </div>
          </div>
          <Table expenses={filteredExpenses} />
        </div>
      </div>
    </>
  );
}
