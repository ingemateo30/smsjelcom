import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Shield } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("admin");

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-orange-600 p-6 space-y-6">
        <h2 className="text-2xl font-bold">Jelcom Dashboard</h2>
        <nav className="space-y-4">
          <button className="flex items-center gap-2 w-full text-left p-3 bg-orange-700 rounded-lg hover:bg-orange-800">
            <User className="w-5 h-5" /> Perfil
          </button>
          {role === "admin" && (
            <button className="flex items-center gap-2 w-full text-left p-3 bg-orange-700 rounded-lg hover:bg-orange-800">
              <Shield className="w-5 h-5" /> Administración
            </button>
          )}
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-900">
        <header className="flex justify-between items-center border-b border-orange-600 pb-4">
          <h1 className="text-3xl font-bold">Bienvenido, {role === "admin" ? "Administrador" : "Usuario"}</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700">
            <LogOut className="w-5 h-5" /> Cerrar sesión
          </button>
        </header>
        
        <section className="mt-6">
          {role === "admin" ? (
            <div className="p-6 bg-orange-700 rounded-lg">Panel de Administración</div>
          ) : (
            <div className="p-6 bg-orange-700 rounded-lg">Panel de Usuario</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

  