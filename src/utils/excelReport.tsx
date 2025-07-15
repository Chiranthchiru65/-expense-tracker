// utils/excelExport.ts
import * as XLSX from "xlsx";
import type { Expense } from "@/services/expenseServices";

export const exportExpensesToExcel = (
  expenses: Expense[],
  filename: string = "expenses"
) => {
  console.log("Step 1: Starting export with", expenses.length, "expenses");

  // STEP 1: Transform your data into Excel-friendly format
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

  console.log("Step 2: Transformed data:", excelData[0]); // Log first row

  // STEP 2: Create a new workbook (think of it as a new Excel file)
  const workbook = XLSX.utils.book_new();
  console.log("Step 3: Created new workbook");

  // STEP 3: Convert JSON data to worksheet (think of it as a sheet tab)
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  console.log("Step 4: Created worksheet from JSON data");

  // STEP 4: Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
  console.log("Step 5: Added worksheet to workbook");

  // STEP 5: Generate filename with current date
  const currentDate = new Date().toISOString().split("T")[0];
  const fullFilename = `${filename}_${currentDate}.xlsx`;
  console.log("Step 6: Generated filename:", fullFilename);

  // STEP 6: Write file and trigger download
  XLSX.writeFile(workbook, fullFilename);
  console.log("Step 7: File download triggered");
};
