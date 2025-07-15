import React, { useEffect, useState } from "react";
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
import { getSettings } from "@/services/settingsStorage";

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
  convertedAmount?: number;
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
  const { isAddModalOpen, closeAddModal, addExpense, isLoading, expenses } =
    useExpenseStore();
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [selectedCurrency, setSelectedCurrency] =
    React.useState<Currency>("INR");
  const [settings, setSettings] = useState(getSettings());
  const [showCustomCategory, setShowCustomCategory] = React.useState(false);
  const [customCategory, setCustomCategory] = React.useState("");
  const shouldShowConversion = selectedCurrency !== "INR";
  const [budgetWarning, setBudgetWarning] = React.useState<string | null>(null);
  const [budgetExceeded, setBudgetExceeded] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    mode: "onBlur",
    defaultValues: {
      title: "",
      amount: undefined,
      currency: "INR",
      paymentMode: "",
      category: "",
      icon: "",
      notes: "",
      date: new Date(),
      convertedAmount: undefined,
    },
  });

  const watchCategory = watch("category");
  const watchAmount = watch("amount");
  const watchConvertedAmount = watch("convertedAmount");

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

  const MONTHLY_BUDGET = settings.monthlyBudget;
  const monthlyExpense = calculateMonthlyExpense();
  const expenseBudgetLeft = MONTHLY_BUDGET - monthlyExpense;
  useEffect(() => {
    const handleSettingsChange = () => {
      setSettings(getSettings());
    };

    window.addEventListener("settingsChanged", handleSettingsChange);

    return () =>
      window.removeEventListener("settingsChanged", handleSettingsChange);
  }, []);
  // updading icon when category change
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

  // update currency in form when tab changes
  React.useEffect(() => {
    setValue("currency", selectedCurrency);
  }, [selectedCurrency, setValue]);

  // update date in form when date picker changes
  React.useEffect(() => {
    setValue("date", selectedDate);
  }, [selectedDate, setValue]);

  const onSubmit = async (data: ExpenseFormData) => {
    if (monthlyExpense > 15000) {
      toast.error("Your monthly expenses limit has exceeded");
      return;
    }
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

      await addExpense(expenseData);

      reset();
      setSelectedDate(new Date());
      setSelectedCurrency("INR");
      setShowCustomCategory(false);
      setCustomCategory("");
      setBudgetWarning(null);
      setBudgetExceeded(false);
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
    setShowCustomCategory(false);
    setCustomCategory("");
  };

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
  const onError = (errors: any) => {
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      toast.error(firstError.message);
    } else {
      toast.error("Please fill in all required fields correctly.");
    }
  };

  React.useEffect(() => {
    const currentAmount = watchAmount || 0;
    if (currentAmount > 0) {
      if (currentAmount > expenseBudgetLeft) {
        setBudgetExceeded(true);
        setBudgetWarning(
          `Expense is exceeding expense budget. Try spending less and decrease the amount by ₹${new Intl.NumberFormat("en-IN").format(currentAmount - expenseBudgetLeft)}`
        );
        toast.error(
          "Expense is exceeding expense budget. Try spending less and decrease the amount."
        );
      } else if (currentAmount > expenseBudgetLeft * 0.8) {
        setBudgetExceeded(false);
        setBudgetWarning(
          `Warning: Only ₹${new Intl.NumberFormat("en-IN").format(expenseBudgetLeft - currentAmount)} left in your monthly budget`
        );
      } else {
        setBudgetExceeded(false);
        setBudgetWarning(null);
      }
    } else {
      setBudgetExceeded(false);
      setBudgetWarning(null);
    }
  }, [
    watchAmount,
    watchConvertedAmount,
    expenseBudgetLeft,
    shouldShowConversion,
  ]);

  return (
    <Dialog open={isAddModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Expense
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
          <div className="p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-gray-600">Budget</div>
                <div className="font-semibold text-md">₹15,000</div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">Spent</div>
                <div className="font-semibold text-md text-orange-600">
                  ₹{new Intl.NumberFormat("en-IN").format(monthlyExpense)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">Remaining</div>
                <div
                  className={`font-semibold text-md ${expenseBudgetLeft < 1000 ? "text-red-600" : "text-green-600"}`}
                >
                  ₹
                  {new Intl.NumberFormat("en-IN").format(
                    Math.max(0, expenseBudgetLeft)
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* two col layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* left column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter expense title"
                  {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 2,
                      message: "Title must be at least 2 characters",
                    },
                  })}
                  className={cn(
                    "transition-all duration-200",
                    errors.title
                      ? "border-red-500 ring-red-100"
                      : "focus:ring-blue-100"
                  )}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  step="0.01"
                  min="0"
                  {...register("amount", {
                    required: "Amount is required",
                    min: {
                      value: 0.01,
                      message: "Amount must be greater than 0",
                    },
                    validate: (value) => {
                      if (isNaN(Number(value)))
                        return "Please enter a valid number";
                      return true;
                    },
                  })}
                  className={cn(
                    "transition-all duration-200",
                    errors.amount
                      ? "border-red-500 ring-red-100"
                      : "focus:ring-blue-100"
                  )}
                />
                {errors.amount && (
                  <p className="text-sm text-red-600">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Currency</Label>
                <Tabs
                  value={selectedCurrency}
                  onValueChange={(value) =>
                    setSelectedCurrency(value as Currency)
                  }
                >
                  <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                    <TabsTrigger value="INR" className="text-sm">
                      INR (₹)
                    </TabsTrigger>
                    <TabsTrigger value="USD" className="text-sm">
                      USD ($)
                    </TabsTrigger>
                    <TabsTrigger value="EUR" className="text-sm">
                      EUR (€)
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {shouldShowConversion && (
                <div className="space-y-2">
                  <Label
                    htmlFor="convertedAmount"
                    className="text-sm font-medium"
                  >
                    Amount in {selectedCurrency}
                  </Label>
                  <Input
                    id="convertedAmount"
                    type="number"
                    placeholder="Enter amount"
                    step="0.01"
                    min="0"
                    {...register("convertedAmount", {
                      required: shouldShowConversion
                        ? "Converted amount is required"
                        : false,
                      min: {
                        value: 0.01,
                        message: "Converted amount must be greater than 0",
                      },
                    })}
                    className={cn(
                      "transition-all duration-200",
                      errors.convertedAmount
                        ? "border-red-500 ring-red-100"
                        : "focus:ring-blue-100"
                    )}
                  />
                  {errors.convertedAmount && (
                    <p className="text-sm text-red-600">
                      {errors.convertedAmount.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Convert {selectedCurrency} amount to INR manually
                  </p>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Category</Label>
                <Select
                  onValueChange={handleCategoryChange}
                  {...register("category", {
                    required: "Please select a category",
                  })}
                >
                  <SelectTrigger
                    className={cn(
                      "transition-all duration-200",
                      errors.category
                        ? "border-red-500 ring-red-100"
                        : "focus:ring-blue-100"
                    )}
                  >
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
                {errors.category && (
                  <p className="text-sm text-red-600">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {showCustomCategory && (
                <div className="space-y-2">
                  <Label
                    htmlFor="customCategory"
                    className="text-sm font-medium"
                  >
                    Custom Category
                  </Label>
                  <Input
                    id="customCategory"
                    placeholder="Enter custom category name"
                    value={customCategory}
                    {...register("category", {
                      required: "Custom category name is required",
                      minLength: {
                        value: 2,
                        message: "Category name must be at least 2 characters",
                      },
                      onChange: (e) => {
                        setCustomCategory(e.target.value);
                        setValue("category", e.target.value);
                      },
                    })}
                    className={cn(
                      "transition-all duration-200",
                      errors.category
                        ? "border-red-500 ring-red-100"
                        : "focus:ring-blue-100"
                    )}
                  />
                  {errors.category && (
                    <p className="text-sm text-red-600">
                      {errors.category.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Enter a name for your custom category
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal transition-all duration-200",
                        !selectedDate && "text-muted-foreground",
                        "hover:bg-gray-50 focus:ring-blue-100"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate
                        ? format(selectedDate, "PPP")
                        : "Pick a date"}
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

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Notes
                </Label>
                <Input
                  id="notes"
                  placeholder="Add notes (optional)"
                  {...register("notes")}
                  className="transition-all duration-200 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {budgetWarning && (
            <div
              className={cn(
                "p-3 rounded-lg text-sm font-medium",
                budgetExceeded
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-yellow-50 text-yellow-700 border border-yellow-200"
              )}
            >
              {budgetWarning}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="px-6 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="px-6 bg-blue-600 hover:bg-blue-700 min-w-[120px]"
            >
              {isLoading || isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </div>
              ) : (
                "Add Expense"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpense;
