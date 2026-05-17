import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import RecipesPage from "../pages/RecipesPage";
import RecipeCreatePage from "../pages/RecipeCreatePage";
import RecipeDetailsPage from "../pages/RecipeDetailsPage";
import RecipeEditPage from "../pages/RecipeEditPage";
import RecipesManagePage from "../pages/RecipesManagePage";
import UsersPage from "../pages/UsersPage";
import UserEditPage from "../pages/UserEditPage";
import NotFoundPage from "../pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "recipes",
        element: <RecipesPage />,
      },
      {
        path: "recipes/:id",
        element: <RecipeDetailsPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "recipes/new",
            element: <RecipeCreatePage />,
          },
          {
            path: "recipes/manage",
            element: <RecipesManagePage />,
          },
          {
            path: "recipes/:id/edit",
            element: <RecipeEditPage />,
          },
          {
            path: "users",
            element: <UsersPage />,
          },
          {
            path: "users/:id/edit",
            element: <UserEditPage />,
          },
        ],
      },
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
