import { Navigate, Outlet } from "react-router-dom";
import { getToken, getUserRole } from "../services/authService";
import { useState, useEffect } from "react";

const PrivateRoute = ({ requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = getToken();
    const role = getUserRole();
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Cargando...</div>; // O un spinner de carga
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" />; // Ruta a página de acceso denegado
  }

  return <Outlet />;
};

export default PrivateRoute;

