import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import Unauthorized from "./pages/unauthorized";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UploadExcel from "./pages/UploadExcel";
import DashboardHome from "./pages/DashboardHome";
import RegisterUser from "./pages/RegisterUser";
import LandingPage from "./pages/LandingPage";
import SendEmails from "./pages/SendEmails";
import SendManualEmail from "./pages/SendManualEmail";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />


        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="subir-excel" element={<UploadExcel />} />
            <Route path="enviar-correos" element={<SendEmails />} />
            <Route path="enviar-correo" element={<SendManualEmail />} />
            <Route element={<PrivateRoute requiredRole="admin" />}>
              <Route path="usuarios" element={<RegisterUser />} />
            </Route>
            <Route path="configuracion" element={<h1>Configuración</h1>} />
          </Route>
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



