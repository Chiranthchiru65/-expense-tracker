import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/income")({
  component: () => (
    <div>
      <h1 className="text-2xl font-bold mb-4">Income Management</h1>
      <p className="text-gray-600">Manage your income sources here.</p>
    </div>
  ),
});
