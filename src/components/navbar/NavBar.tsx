import useExpenseStore from "@/store/expenseStore";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  // Settings,
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
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getSettings,
  saveSettings,
  type Settings,
} from "@/services/settingsStorage";
interface NavBarProps {
  title: string;
}

interface SettingsFormData {
  monthlyIncome: number;
  monthlyBudget: number;
  defaultCurrency: string;
}

function NavBar({ title }: NavBarProps) {
  const { openAddModal, expenses } = useExpenseStore();
  const [popup, setPopup] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [settings, setSettings] = useState<Settings>(getSettings());
  const [selectedCurrency, setSelectedCurrency] = useState<string>("INR");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormData>({
    defaultValues: {
      monthlyIncome: settings.monthlyIncome,
      monthlyBudget: settings.monthlyBudget,
      defaultCurrency: settings.defaultCurrency,
    },
  });

  useEffect(() => {
    const loadedSettings = getSettings();
    setSettings(loadedSettings);
    reset({
      monthlyIncome: loadedSettings.monthlyIncome,
      monthlyBudget: loadedSettings.monthlyBudget,
      defaultCurrency: loadedSettings.defaultCurrency,
    });
  }, [reset]);
  const selectedCurrency = watch("defaultCurrency");
  useEffect(() => {
    if (popup) {
      reset({
        monthlyIncome: settings.monthlyIncome,
        monthlyBudget: settings.monthlyBudget,
      });
    }
  }, [popup, settings, reset]);

  const onSubmitSettings = (data: SettingsFormData) => {
    try {
      const newSettings: Settings = {
        monthlyIncome: Number(data.monthlyIncome),
        monthlyBudget: Number(data.monthlyBudget),
        defaultCurrency: settings.defaultCurrency ?? "INR",
      };

      saveSettings(newSettings);

      setSettings(newSettings);

      setPopup(false);

      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    }
  };

  const handleCancel = () => {
    reset({
      monthlyIncome: settings.monthlyIncome,
      monthlyBudget: settings.monthlyBudget,
    });
    setPopup(false);
  };

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
          <DialogTrigger asChild>
            <Button variant="outline">
              {/* <Settings /> */}{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                // class="lucide lucide-settings-icon lucide-settings"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit(onSubmitSettings)}>
              <DialogHeader>
                <DialogTitle>Financial Settings</DialogTitle>
                <DialogDescription>
                  Update your monthly income and budget. These settings will be
                  saved locally.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-3">
                  <Label htmlFor="monthlyIncome">Monthly Income (₹)</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="Enter your monthly income"
                    {...register("monthlyIncome", {
                      required: "Monthly income is required",
                      min: {
                        value: 0,
                        message: "Income must be a positive number",
                      },
                      valueAsNumber: true,
                    })}
                    className={errors.monthlyIncome ? "border-red-500" : ""}
                  />
                  {errors.monthlyIncome && (
                    <p className="text-sm text-red-600">
                      {errors.monthlyIncome.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="monthlyBudget">Monthly Budget (₹)</Label>
                  <Input
                    id="monthlyBudget"
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="Enter your monthly budget"
                    {...register("monthlyBudget", {
                      required: "Monthly budget is required",
                      min: {
                        value: 0,
                        message: "Budget must be a positive number",
                      },
                      valueAsNumber: true,
                    })}
                    className={errors.monthlyBudget ? "border-red-500" : ""}
                  />
                  {errors.monthlyBudget && (
                    <p className="text-sm text-red-600">
                      {errors.monthlyBudget.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="monthlyBudget">Select Default Currency</Label>
                  <Select
                    value={selectedCurrency}
                    onValueChange={(value) => setSelectedCurrency(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Default Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Currencies</SelectLabel>
                        <SelectItem value="INR">INR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[100px]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
}

export default NavBar;
