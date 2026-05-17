import { Navigate, Outlet } from "react-router-dom";
import { getAuthUser } from "../utils/authStorage";

const AdminRoute = () => {
  const authUser = getAuthUser();

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (authUser.role !== "admin") {
    return <Navigate to="/recipes" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
