import NavBar from "@/components/navbar/NavBar";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});
function RootComponent() {
  return (
    <>
      <div className="min-h-screen bg-gray-50 flex">
        <NavBar title="Expense Tracker" />
        <aside className="w-64 bg-white shadow-sm border-r"></aside>

        <main className="flex-1">
          <div className="p-6 bg-white border-b">
            <h1 className="text-2xl font-bold text-gray-900">
              Expense Tracker
            </h1>
          </div>

          <div className="p-6">
            <Outlet />
          </div>
        </main>

        <TanStackRouterDevtools />
      </div>
    </>
  );
}
