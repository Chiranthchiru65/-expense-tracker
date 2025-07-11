import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";
import "../../src/index.css";
import SideBar from "@/components/sidebar/sideBar";
import NavBar from "@/components/navbar/navBar";
import AddExpense from "@/components/modals/addExpense";

export const Route = createRootRoute({
  component: RootComponent,
});
function RootComponent() {
  return (
    <>
      <NavBar title="Expense Tracker" />
      <div className="min-h-screen bg-gray-100 flex">
        <SideBar />
        <AddExpense />
        {/* <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        /> */}
        <Toaster position="top-center" richColors />
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
