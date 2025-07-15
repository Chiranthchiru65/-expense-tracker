import * as XLSX from "xlsx";
import type { Expense } from "@/services/expenseServices";

export const exportExpensesToExcel = (
  expenses: Expense[],
  filename: string = "expenses"
) => {
  // 1: transform your data into Excel-friendly format
  const excelData = expenses.map((expense) => ({
    Date: new Date(expense.date).toLocaleDateString("en-IN"),
    Title: expense.title,
    Category: expense.category,
    Amount: expense.amount,
    Currency: expense.currency,
    "Converted Amount (INR)": expense.convertedAmount || "-",
    "Payment Mode": expense.paymentMode,
    Notes: expense.notes || "-",
    "Created At": new Date(expense.createdAt).toLocaleDateString("en-IN"),
  }));

  //  2: create a new workbook (think of it as a new Excel file)
  const workbook = XLSX.utils.book_new();

  // 3: convert JSON data to worksheet (think of it as a sheet tab)
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // 4: add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "expenses");

  const fullFilename = `${filename}_.xlsx`;

  // 6: write file and trigger download
  XLSX.writeFile(workbook, fullFilename);
};
