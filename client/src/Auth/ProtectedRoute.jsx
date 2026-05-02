import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkAuth } from "../Service/auth.service.js";
function ProtectedRoute() {
  const [auth, setAuth] = useState(null);
  useEffect(() => {
    checkAuth()
      .then(() => setAuth(true))
      .catch(() => setAuth(false));
  }, []);
  if (auth === null) return null;
  return auth ? <Outlet /> : <Navigate to="/login" replace />;
}
export default ProtectedRoute;