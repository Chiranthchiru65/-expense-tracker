import useExpenseStore from "@/store/expenseStore";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Settings,
  TrendingUp,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import DailyExpenseChart from "../charts/dailyExpenseChart";
import { useState } from "react";

interface NavBarProps {
  title: string;
}

function NavBar({ title }: NavBarProps) {
  const { openAddModal, expenses } = useExpenseStore();
  const [popup, setPopup] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const monthName = selectedMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const goToPreviousMonth = () => {
    setSelectedMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() - 1);
      return newMonth;
    });
  };

  const goToNextMonth = () => {
    setSelectedMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + 1);
      return newMonth;
    });
  };

  const isCurrentMonth = () => {
    const today = new Date();
    return (
      selectedMonth.getMonth() === today.getMonth() &&
      selectedMonth.getFullYear() === today.getFullYear()
    );
  };

  return (
    <nav className="p-4 border flex justify-between">
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="flex gap-4">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Track Daily Expense
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[90vh]">
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousMonth}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft />
                </Button>

                <div className="text-center">
                  <h3 className="text-lg font-semibold">{monthName}</h3>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextMonth}
                  disabled={isCurrentMonth()}
                  className="h-8 w-8 p-0 disabled:opacity-50"
                >
                  <ChevronRight />
                </Button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-4">
                  Expense Overview
                </h4>
                <DailyExpenseChart
                  expenses={expenses}
                  selectedMonth={selectedMonth}
                />
              </div>
            </div>

            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <Button onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
        <Dialog open={popup} onOpenChange={setPopup}>
          <form>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your monthly income & budget here. done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">Monthly Income</Label>
                  <Input defaultValue="Enter amount" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="username-1">Monthly Budget</Label>
                  <Input defaultValue="Enter your budget" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </nav>
  );
}

export default NavBar;
