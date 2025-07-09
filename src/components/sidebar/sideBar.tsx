import { Link } from "@tanstack/react-router";

interface NavBarProps {
  title: string;
}

function NavBar({ title }: NavBarProps) {
  return (
    <nav className="p-4 bg-blue-500 text-white">
      <h1 className="text-xl font-bold">{title}</h1>
      <section className="p-4 space-y-2">
        <Link
          to="/"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 [&.active]:bg-blue-600 [&.active]:text-white"
        >
          <span>📊</span>
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

        <button className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full text-left">
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </section>
    </nav>
  );
}

export default NavBar;
