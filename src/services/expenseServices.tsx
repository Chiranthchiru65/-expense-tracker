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
