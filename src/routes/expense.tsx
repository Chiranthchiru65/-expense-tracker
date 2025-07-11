import { Button } from "@/components/ui/button";
import useExpenseStore from "@/store/expenseStore";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Plus } from "lucide-react";

export const Route = createFileRoute("/expense")({
  component: () => <Expense />,
});
function Expense() {
  const { expenses, fetchExpenses, openAddModal } = useExpenseStore();

  function handleFetch() {
    fetchExpenses();
    console.log();
  }
  return (
    <>
      <div>
        <div className="w-full bg-white rounded-lg px-4 py-3">
          <div className="flex justify-between items-center ">
            <h1 className="text-xl font-bold ">All Expenses</h1>
            <div>
              <Button variant="outline" onClick={handleFetch}>
                <span>
                  <Download />
                </span>
                Download
              </Button>
              <Button onClick={openAddModal}>
                <span>
                  <Plus />
                </span>
                Add Expense
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
