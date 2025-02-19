import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import Unauthorized from "./pages/unauthorized";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Rutas protegidas para cualquier usuario autenticado */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Rutas protegidas SOLO para administradores */}
        <Route element={<PrivateRoute requiredRole="admin" />}>
          <Route path="/admin" element={<h1>Panel de Administrador</h1>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;


