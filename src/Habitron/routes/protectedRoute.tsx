import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const ProtectedRoute = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  const basePath =
    window.location.hash.split("#")[1]?.split("/").slice(0, -1).join("/") || "";

  return token ? <Outlet /> : <Navigate to={`${basePath}/login`} replace />;
};

export default ProtectedRoute;
