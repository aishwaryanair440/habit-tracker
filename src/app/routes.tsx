import { createBrowserRouter, Outlet } from "react-router";
import { Dashboard } from "./components/Dashboard";
import { MonthlyReview } from "./components/MonthlyReview";
import { ThemeProvider } from "./context/ThemeContext";
import { HabitProvider } from "./context/HabitContext";
import { Toaster } from "sonner";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ThemeProvider>
        <HabitProvider>
          <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
            <Outlet />
            <Toaster position="bottom-right" />
          </div>
        </HabitProvider>
      </ThemeProvider>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "review",
        element: <MonthlyReview />,
      },
    ],
  },
]);
