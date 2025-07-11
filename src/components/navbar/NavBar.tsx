import useExpenseStore from "@/store/expenseStore";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface NavBarProps {
  title: string;
}

function NavBar({ title }: NavBarProps) {
  const { openAddModal } = useExpenseStore();
  return (
    <nav className="p-4 border flex justify-between">
      <h1 className="text-xl font-bold">{title}</h1>
      <Button onClick={openAddModal}>
        <span>
          <Plus />
        </span>
        Add Expense
      </Button>
    </nav>
  );
}

export default NavBar;
