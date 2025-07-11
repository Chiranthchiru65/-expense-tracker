// components/modals/AddExpense.tsx
import React from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import useExpenseStore from "@/store/expenseStore";
import { toast } from "sonner";

type Currency = "INR" | "USD" | "EUR";

interface ExpenseFormData {
  title: string;
  amount: number;
  currency: Currency;
  paymentMode: string;
  category: string;
  icon: string;
  notes: string;
  date: Date;
}

const categories = [
  { value: "Food & Drinks", label: "Food & Drinks", icon: "🍕" },
  { value: "Shopping", label: "Shopping", icon: "🛍️" },
  { value: "Housing", label: "Housing", icon: "🏠" },
  { value: "Transportation", label: "Transportation", icon: "🚗" },
  { value: "Vehicle", label: "Vehicle", icon: "🚙" },
  { value: "Life & Entertainment", label: "Life & Entertainment", icon: "🎬" },
  {
    value: "Communication & Internet",
    label: "Communication & Internet",
    icon: "📱",
  },
  { value: "Investments", label: "Investments", icon: "📈" },
  { value: "Financial Expenses", label: "Financial Expenses", icon: "💳" },
  { value: "Others", label: "Others", icon: "📦" },
];

const AddExpense: React.FC = () => {
  const { isAddModalOpen, closeAddModal, addExpense, isLoading } =
    useExpenseStore();
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [selectedCurrency, setSelectedCurrency] =
    React.useState<Currency>("INR");

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<ExpenseFormData>({
      defaultValues: {
        title: "",
        amount: undefined,
        currency: "INR",
        paymentMode: "",
        category: "",
        icon: "",
        notes: "",
        date: new Date(),
      },
    });

  const watchCategory = watch("category");

  // updading icon when category change
  React.useEffect(() => {
    const selectedCategoryData = categories.find(
      (cat) => cat.value === watchCategory
    );
    if (selectedCategoryData) {
      setValue("icon", selectedCategoryData.icon);
    }
  }, [watchCategory, setValue]);

  // update currency in form when tab changes
  React.useEffect(() => {
    setValue("currency", selectedCurrency);
  }, [selectedCurrency, setValue]);

  // update date in form when date picker changes
  React.useEffect(() => {
    setValue("date", selectedDate);
  }, [selectedDate, setValue]);

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      const expenseData = {
        ...data,
        date: data.date.toISOString(),
        amount: Number(data.amount),
      };

      await addExpense(expenseData);

      reset();
      setSelectedDate(new Date());
      setSelectedCurrency("INR");
      toast.success("expense added successfully!");
    } catch (error) {
      toast.error("failed to add expense. please try again.");
    }
  };

  const handleClose = () => {
    reset();
    setSelectedDate(new Date());
    setSelectedCurrency("INR");
    closeAddModal();
  };

  return (
    <Dialog open={isAddModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter expense title"
              {...register("title", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              step="0.01"
              min="0"
              {...register("amount", { required: true, min: 0 })}
            />
          </div>

          <div className="space-y-2">
            <Label>Currency</Label>
            <Tabs
              value={selectedCurrency}
              onValueChange={(value) => setSelectedCurrency(value as Currency)}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="INR">INR (₹)</TabsTrigger>
                <TabsTrigger value="USD">USD ($)</TabsTrigger>
                <TabsTrigger value="EUR">EUR (€)</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="paymentMode">Payment Mode</Label>
            <Input
              id="paymentMode"
              placeholder="e.g., Credit Card, UPI, Cash"
              {...register("paymentMode", { required: true })}
            />
          </div> */}

          <div className="space-y-2">
            <Label>Category</Label>
            <Select onValueChange={(value) => setValue("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center space-x-2">
                      <span>{category.icon}</span>
                      <span>{category.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  disabled={(date) => date > new Date()} // Disable future dates
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              placeholder="Add notes (optional)"
              {...register("notes")}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Expense"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpense;
