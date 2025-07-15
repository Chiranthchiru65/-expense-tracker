import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table";
import { Edit, Trash2, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Expense } from "@/services/expenseServices";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import EditExpense from "../editExpense.tsx/EditExpense";
import useExpenseStore from "@/store/expenseStore";
const columnHelper = createColumnHelper<Expense>();

interface TableProps {
  expenses: Expense[];
}

const Table: React.FunctionComponent<TableProps> = ({ expenses }) => {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "date", desc: true },
  ]);
  const { deleteExpense } = useExpenseStore();

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [expenseToDelete, setExpenseToDelete] = React.useState<Expense | null>(
    null
  );

  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [expenseToEdit, setExpenseToEdit] = React.useState<Expense | null>(
    null
  );
  const handleEdit = (expense: Expense) => {
    setExpenseToEdit(expense);
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setExpenseToEdit(null);
  };
  const handleDeleteClick = (expense: Expense) => {
    setExpenseToDelete(expense);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!expenseToDelete) return;

    try {
      await deleteExpense(expenseToDelete.id);
      toast.success("Expense deleted successfully!");
      setDeleteDialogOpen(false);
      setExpenseToDelete(null);
    } catch (error) {
      toast.error("Failed to delete expense. Please try again.");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setExpenseToDelete(null);
  };
  const columns = [
    columnHelper.accessor("title", {
      header: ({ column }) => (
        <button
          // variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          // className="h-auto p-0 font-semibold"
          className="flex items-center pl-4 cursor-pointer"
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      ),
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
            {info.row.original.icon || "💳"}
          </div>
          <div>
            <div className="font-medium text-gray-900">{info.getValue()}</div>
            <div className="text-sm text-gray-500">
              {info.row.original.notes}
            </div>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("amount", {
      header: ({ column }) => (
        <button
          // variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          // className="h-auto p-0 font-semibold"
          className="flex items-center cursor-pointer"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      ),
      cell: (info) => (
        <div className="font-medium text-gray-900">
          {new Intl.NumberFormat("en-IN").format(info.getValue())}
        </div>
      ),
    }),
    // columnHelper.accessor("currency", {
    //   header: "currency",
    //   cell: (info) => info.getValue(),
    // }),
    columnHelper.accessor("currency", {
      header: "Currency",
      cell: (info) => (
        <Badge
          variant="secondary"
          className="bg-blue-500 text-white dark:bg-blue-600"
        >
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor("convertedAmount", {
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          // className="h-auto p-0 font-semibold"
          className="flex items-center cursor-pointer "
        >
          convt-Amt
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      ),
      cell: (info) => {
        const value = info.getValue();
        return (
          <div className="font-medium text-gray-700">
            {value ? `${new Intl.NumberFormat("en-IN").format(value)}` : "-"}
          </div>
        );
      },
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: (info) => (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 hover:bg-green-200"
        >
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor("date", {
      header: ({ column }) => (
        <button
          // variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          // className="h-auto p-0 font-semibold"
          className="flex items-center cursor-pointer"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      ),
      cell: (info) => {
        const date = new Date(info.getValue());
        return (
          <div className="text-gray-900">
            <div className="font-medium">
              {date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
              })}
            </div>
            <div className="text-sm text-gray-500">{date.getFullYear()}</div>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(info.row.original)}
            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50 cursor-pointer"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteClick(info.row.original)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    }),
  ];
  const table = useReactTable<Expense>({
    data: expenses,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  return (
    <div className="">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-200">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={` py-4 px-2  text-left text-sm font-medium text-gray-900 ${
                      header.id === "title"
                        ? " min-w-[255px] "
                        : header.id === "actions"
                          ? "w-26"
                          : header.id === "currency"
                            ? "w-26"
                            : "w-32"
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No expenses found. Add your first expense!
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50/50 transition-colors duration-150"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-4 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{expenseToDelete?.title}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <EditExpense
        expense={expenseToEdit}
        isOpen={editModalOpen}
        onClose={handleEditClose}
      />
    </div>
  );
};
export default Table;
