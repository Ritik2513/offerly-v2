import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RoleRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  //   wait auth check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        loading
      </div>
    );
  }

  //no user
  if (!user) {
    return <Navigate to="/login" />;
  }

  //role check
  if (!allowedRoles.includes(user.role)) {
    return (
      <Navigate to={user.role === "admin" ? "/dashboard" : "/affiliate"} />
    );
  }

  return <Outlet />;
};

export default RoleRoute;
