import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import LotteryPage from "@/pages/LotteryPage";
import EmployeeManagementPage from "@/pages/EmployeeManagementPage";
import ProjectManagementPage from "@/pages/ProjectManagementPage";
import LoginPage from "@/pages/LoginPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <LotteryPage />,
      },
      {
        path: "employees",
        element: <EmployeeManagementPage />,
      },
      {
        path: "project-management",
        element: <ProjectManagementPage />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
