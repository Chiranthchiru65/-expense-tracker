import { create } from "zustand";
import {
  getAllExpenses,
  createExpense,
  deleteExpense,
  editExpense,
} from "@/services/expenseServices";
import type { Expense } from "@/services/expenseServices";

interface ExpenseStore {
  // states
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
  isLoaded: boolean;
  isAddModalOpen: boolean;
  // actions
  fetchExpenses: () => Promise<void>;
  addExpense: (expenseData: Omit<Expense, "id" | "createdAt">) => Promise<void>;
  openAddModal: () => void;
  closeAddModal: () => void;
  toggleAddModal: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  deleteExpense: (id: string) => Promise<void>;
  editExpense: (
    id: string,
    expenseData: Omit<Expense, "id" | "createdAt">
  ) => Promise<void>;
}

const useExpenseStore = create<ExpenseStore>((set, get) => ({
  // initial State
  expenses: [],
  isLoading: false,
  error: null,
  isLoaded: false,
  isAddModalOpen: false,

  // fetch all expenses
  fetchExpenses: async () => {
    const { isLoaded } = get();

    // return cached data if already loaded
    if (isLoaded) {
      console.log("Using cached expense data");
      return;
    }

    try {
      console.log("Fetching fresh expense data from server");
      set({ isLoading: true, error: null });

      const data = await getAllExpenses();

      set({
        expenses: data,
        isLoaded: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
      set({
        error: "Failed to fetch expenses. Please try again.",
        isLoading: false,
      });
    }
  },

  addExpense: async (expenseData) => {
    try {
      set({ isLoading: true, error: null });

      // create expense on backend
      const newExpense = await createExpense(expenseData);

      // optimistically add to local state
      set((state) => ({
        expenses: [newExpense, ...state.expenses],
        isLoading: false,
        error: null,
        isAddModalOpen: false, // Close modal on success
      }));

      console.log("expense added :", newExpense);
    } catch (error) {
      console.error("Failed to add expense:", error);
      set({
        error: "Failed to add expense. Please try again.",
        isLoading: false,
      });

      throw error;
    }
  },

  openAddModal: () => {
    set({ isAddModalOpen: true, error: null });
  },

  closeAddModal: () => {
    set({ isAddModalOpen: false, error: null });
  },

  toggleAddModal: () => {
    set((state) => ({
      isAddModalOpen: !state.isAddModalOpen,
      error: null,
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  deleteExpense: async (id: string) => {
    try {
      set({ isLoading: true, error: null });

      set((state) => ({
        expenses: state.expenses.filter((expense) => expense.id !== id),
      }));

      await deleteExpense(id);

      set({ isLoading: false });
    } catch (error) {
      get().fetchExpenses();
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to delete expense",
      });
      throw error;
    }
  },
  editExpense: async (
    id: string,
    expenseData: Omit<Expense, "id" | "createdAt">
  ) => {
    try {
      set({ isLoading: true, error: null });

      const updatedExpense = await editExpense(id, expenseData);

      set((state) => ({
        expenses: state.expenses.map((expense) =>
          expense.id === id ? updatedExpense : expense
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to update expense",
      });
      throw error;
    }
  },
}));

export default useExpenseStore;
