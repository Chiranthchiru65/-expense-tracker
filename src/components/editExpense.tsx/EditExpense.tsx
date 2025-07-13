// components/modals/EditExpense.tsx
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import type { Expense, Currency } from "@/services/expenseServices";

interface ExpenseFormData {
  title: string;
  amount: number;
  currency: Currency;
  paymentMode: string;
  category: string;
  icon: string;
  notes: string;
  date: Date;
  convertedAmount?: number;
}

interface EditExpenseProps {
  expense: Expense | null;
  isOpen: boolean;
  onClose: () => void;
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

const EditExpense: React.FC<EditExpenseProps> = ({
  expense,
  isOpen,
  onClose,
}) => {
  const { editExpense, isLoading } = useExpenseStore();
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [selectedCurrency, setSelectedCurrency] =
    React.useState<Currency>("INR");
  const [showCustomCategory, setShowCustomCategory] = React.useState(false);
  const [customCategory, setCustomCategory] = React.useState("");

  const shouldShowConversion = selectedCurrency !== "INR";

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<ExpenseFormData>();

  const watchCategory = watch("category");

  // Load expense data when modal opens
  React.useEffect(() => {
    if (expense && isOpen) {
      // Populate form with existing expense data
      setValue("title", expense.title);
      setValue("amount", expense.amount);
      setValue("currency", expense.currency);
      setValue("paymentMode", expense.paymentMode);
      setValue("category", expense.category);
      setValue("icon", expense.icon);
      setValue("notes", expense.notes);
      setValue("convertedAmount", expense.convertedAmount);

      // Set dates and currency
      const expenseDate = new Date(expense.date);
      setSelectedDate(expenseDate);
      setValue("date", expenseDate);
      setSelectedCurrency(expense.currency);

      // Handle custom category
      const isCustomCategory = !categories.find(
        (cat) => cat.value === expense.category
      );
      if (isCustomCategory) {
        setShowCustomCategory(true);
        setCustomCategory(expense.category);
      }
    }
  }, [expense, isOpen, setValue]);

  // Icon update effect
  React.useEffect(() => {
    const selectedCategoryData = categories.find(
      (cat) => cat.value === watchCategory
    );

    if (selectedCategoryData) {
      setValue("icon", selectedCategoryData.icon);
    } else if (showCustomCategory && customCategory) {
      setValue("icon", "📦");
    }
  }, [watchCategory, setValue, showCustomCategory, customCategory]);

  // Currency update effect
  React.useEffect(() => {
    setValue("currency", selectedCurrency);
  }, [selectedCurrency, setValue]);

  // Date update effect
  React.useEffect(() => {
    setValue("date", selectedDate);
  }, [selectedDate, setValue]);

  const handleCategoryChange = (value: string) => {
    setValue("category", value);

    if (value === "Others") {
      setShowCustomCategory(true);
      setValue("category", "");
    } else {
      setShowCustomCategory(false);
      setCustomCategory("");
    }
  };

  const onSubmit = async (data: ExpenseFormData) => {
    if (!expense) return;

    try {
      const expenseData = {
        ...data,
        date: data.date.toISOString(),
        amount: Number(data.amount),
        ...(shouldShowConversion &&
          data.convertedAmount && {
            convertedAmount: Number(data.convertedAmount),
          }),
      };

      await editExpense(expense.id, expenseData);
      toast.success("Expense updated successfully!");
      handleClose();
    } catch (error) {
      toast.error("Failed to update expense. Please try again.");
    }
  };

  const handleClose = () => {
    reset();
    setSelectedDate(new Date());
    setSelectedCurrency("INR");
    setShowCustomCategory(false);
    setCustomCategory("");
    onClose();
  };

  if (!expense) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter expense title"
              {...register("title", { required: true })}
            />
          </div>

          {/* Amount Field */}
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

          {/* Conversion Field */}
          {shouldShowConversion && (
            <div className="space-y-2">
              <Label htmlFor="convertedAmount">Amount in INR</Label>
              <Input
                id="convertedAmount"
                type="number"
                placeholder="Enter amount in INR"
                step="0.01"
                min="0"
                {...register("convertedAmount", {
                  required: shouldShowConversion,
                  min: 0,
                })}
              />
              <p className="text-xs text-gray-500">
                Convert {selectedCurrency} amount to INR manually
              </p>
            </div>
          )}

          {/* Currency Tabs */}
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

          {/* Category Field */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={showCustomCategory ? "Others" : watchCategory}
              onValueChange={handleCategoryChange}
            >
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

            {showCustomCategory && (
              <div className="mt-2 space-y-2">
                <Label htmlFor="customCategory">Custom Category</Label>
                <Input
                  id="customCategory"
                  placeholder="Enter custom category name"
                  value={customCategory}
                  {...register("category", {
                    required: true,
                    onChange: (e) => {
                      setCustomCategory(e.target.value);
                      setValue("category", e.target.value);
                    },
                  })}
                />
              </div>
            )}
          </div>

          {/* Date Field */}
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
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Notes Field */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              placeholder="Add notes (optional)"
              {...register("notes")}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Expense"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditExpense;
