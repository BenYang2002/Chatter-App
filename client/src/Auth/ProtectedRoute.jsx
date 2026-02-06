import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
function ProtectedRoute() {
  const [auth, setAuth] = useState(null);
  useEffect(() => {
    const auth = () => {
      fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      }).then((res) => {
        if (res.status === 200) {
          setAuth(true);
        } else {
          setAuth(false);
        }
      });
    };
    auth();
  }, []);
  if (auth === null) {
    return null;
  }
  return auth ? <Outlet /> : <Navigate to="/login" replace />;
}
export default ProtectedRoute;
