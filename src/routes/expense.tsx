import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/expense")({
  component: () => (
    <div>
      <h1 className="text-2xl font-bold mb-4">Expense Management</h1>
      <p className="text-gray-600">Track and manage your expenses here.</p>
    </div>
  ),
});
