import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldX, LogIn } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Eliminar los datos de sesión del almacenamiento local
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // También puedes limpiar sessionStorage si lo usaste
    sessionStorage.clear();

    // Redirigir al usuario al login
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-700/30 p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <ShieldX className="w-16 h-16 text-orange-400" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Acceso Denegado
          </h2>
          <p className="text-gray-400 mt-4">
            No tienes los permisos necesarios para acceder a esta página. Por favor, inicia sesión con una cuenta autorizada.
          </p>
        </div>

        <button
          onClick={handleLogout} // Llamamos la función al hacer clic
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3.5 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300"
        >
          <LogIn className="w-5 h-5" />
          Volver al Login
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
