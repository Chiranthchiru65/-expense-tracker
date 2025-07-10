import { Link } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";
interface NavBarProps {}

function SideBar({}: NavBarProps) {
  return (
    <nav className=" bg-white border">
      <section className="p-4 space-y-2">
        <Link
          to="/"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 [&.active]:bg-blue-600 [&.active]:text-white"
        >
          <span>
            <LayoutDashboard />
          </span>
          <span>Dashboard</span>
        </Link>

        <Link
          to="/income"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 [&.active]:bg-blue-600 [&.active]:text-white"
        >
          <span>💰</span>
          <span>Income</span>
        </Link>

        <Link
          to="/expense"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 [&.active]:bg-blue-600 [&.active]:text-white"
        >
          <span>💸</span>
          <span>Expense</span>
        </Link>
      </section>
    </nav>
  );
}

export default SideBar;
