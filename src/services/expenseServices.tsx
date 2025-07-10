export interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: string;
  paymentMode: string;
  category: string;
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
