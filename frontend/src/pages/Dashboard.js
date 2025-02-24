import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaCog,
  FaUsers,
  FaChevronLeft,
  FaUpload,
  FaPaperPlane,
  FaEnvelope,
  FaSms,
} from "react-icons/fa";
import logo from "../assets/logos-jelcom.png";
import { sendReminderEmails } from "../services/emailService";

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("rol");
    if (!userRole) {
      navigate("/");
    } else {
      setRole(userRole);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleSendReminders = async () => {
    setMessage("Enviando recordatorios...");
    const result = await sendReminderEmails();
    setMessage(result.message);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <aside
        className={`${
          isCollapsed ? "w-20" : "w-64"
        } bg-gray-800/50 backdrop-blur-lg border-r border-gray-700 transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <img
            src={logo}
            alt="Jelcom Logo"
            className={`h-10 transition-opacity ${
              isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
            }`}
          />
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            {isCollapsed ? <FaBars /> : <FaChevronLeft className="hover:-translate-x-1 transition-transform" />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {role === "admin" && (
            <>
              <SidebarButton icon={<FaHome />} text="Inicio" collapsed={isCollapsed} onClick={() => navigate("/dashboard")} />
              <SidebarButton icon={<FaUsers />} text="Usuarios" collapsed={isCollapsed} onClick={() => navigate("/dashboard/usuarios")} />
            </>
          )}
          <SidebarButton icon={<FaCog />} text="Configuración" collapsed={isCollapsed} onClick={() => navigate("/dashboard/configuracion")} />
          <SidebarButton icon={<FaUpload />} text="Subir Excel" collapsed={isCollapsed} onClick={() => navigate("/dashboard/subir-excel")} />
          <SidebarButton icon={<FaPaperPlane />} text="Correos automaticos" collapsed={isCollapsed} onClick={() => navigate("/dashboard/enviar-correos")} /> {/* ✅ Nuevo botón */}
          <SidebarButton icon={<FaEnvelope />} text="Enviar Correo manual" collapsed={isCollapsed} onClick={() => navigate("/dashboard/enviar-correo")} />
          <SidebarButton icon={<FaSms/>} text="sms automaticos" collapsed={isCollapsed} onClick={() => navigate("/dashboard/enviar-sms")} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="flex justify-between items-center p-4 bg-gray-800/50 backdrop-blur-lg border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold">U</span>
            </div>
            <div>
              <p className="text-white font-medium">Bienvenido</p>
              <p className="text-xs text-gray-400">{role}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-700/50 text-gray-300 hover:text-white transition-colors">
              <FaUser />
              <span>Perfil</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg text-white hover:opacity-90 transition-opacity"
            >
              <FaSignOutAlt />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </header>

        
          <Outlet />
  
      </main>
    </div>
  );
};
const SidebarButton = ({ icon, text, collapsed, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700/50 text-gray-300 hover:text-white transition-all"
  >
    {icon}
    {!collapsed && <span className="text-sm">{text}</span>}
  </button>
);

export default Dashboard;

