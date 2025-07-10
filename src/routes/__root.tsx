import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "../../src/index.css";
import SideBar from "@/components/sidebar/sideBar";
import NavBar from "@/components/navbar/navBar";

export const Route = createRootRoute({
  component: RootComponent,
});
function RootComponent() {
  return (
    <>
      <NavBar title="Expense Tracker" />
      <div className="min-h-screen bg-gray-100 flex">
        <SideBar />

        <main className="flex-1">
          <div className="p-6">
            <Outlet />
          </div>
        </main>

        <TanStackRouterDevtools />
      </div>
    </>
  );
}
