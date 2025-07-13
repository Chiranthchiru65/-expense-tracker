export type Currency = "INR" | "USD" | "EUR";

export interface Expense {
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

export const getAllExpenses = async (): Promise<Expense[]> => {
  try {
    const response = await fetch("http://127.0.0.1:3001/expenses");
    if (!response.ok) {
      throw new Error(`http error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.log("errir fetching data", err);
    throw err;
  }
};

export const createExpense = async (
  payload: Omit<Expense, "id" | "createdAt">
): Promise<Expense> => {
  try {
    const expenseData = {
      ...payload,
      createdAt: new Date().toISOString(),
    };
    const response = await fetch("http://localhost:3001/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expenseData),
    });

    if (!response.ok) {
      throw new Error(`Error creating expense: ${response.status}`);
    }

    const createdExpense: Expense = await response.json();
    return createdExpense;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const editExpense = async (
  id: string,
  payload: Omit<Expense, "id" | "createdAt">
): Promise<Expense> => {
  try {
    const response = await fetch(`http://localhost:3001/expenses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error updating expense: ${response.status}`);
    }

    const updatedExpense: Expense = await response.json();
    return updatedExpense;
  } catch (err) {
    console.error("Error editing expense:", err);
    throw err;
  }
};

export const deleteExpense = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:3001/expenses/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error deleting expense: ${response.status}`);
    }

    return;
  } catch (err) {
    console.error("Error deleting expense:", err);
    throw err;
  }
};
