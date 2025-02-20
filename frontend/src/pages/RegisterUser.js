import React, { useState, useEffect } from "react";

const RegisterUser = () => {
  const [formData, setFormData] = useState({ nombre: "", email: "", password: "" });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/usuarios");
      if (!response.ok) throw new Error("Error al obtener usuarios");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!formData.nombre || !formData.email || !formData.password) {
      setError("Todos los campos son obligatorios");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error en el registro");
      setSuccess("Usuario registrado con éxito");
      setFormData({ nombre: "", email: "", password: "" });
      fetchUsers();
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleUserStatus = async (id, estado) => {
    try {
      const nuevoEstado = estado === "activo" ? "inactivo" : "activo";
      
      const response = await fetch(`http://localhost:3000/api/auth/usuarios/${id}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
  
      if (!response.ok) {
        throw new Error("Error al actualizar el estado del usuario");
      }
  
      // Actualizar el estado localmente sin recargar la lista completa
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, estado: nuevoEstado } : user
        )
      );
  
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };
  

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl mx-auto">
      <h2 className="text-white text-2xl font-bold text-center mb-4">Registrar Nuevo Usuario</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-2">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" required />
        <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" required />
        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">Registrar Usuario</button>
      </form>
      <h3 className="text-white text-xl font-bold mt-6">Lista de Usuarios</h3>
      <div className="overflow-x-auto">
        <table className="w-full bg-gray-700 text-white mt-2 rounded-lg border border-gray-600">
          <thead>
            <tr className="bg-gray-500 text-left">
              <th className="py-2 px-4">Nombre</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Rol</th>
              <th className="py-2 px-4 text-center">Estado</th>
              <th className="py-2 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="border-b border-gray-600">
                  <td className="py-2 px-4">{user.nombre}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.rol}</td>
                  <td className="py-2 px-4 text-center">
                    <span className={user.estado === "activo" ? "text-green-400" : "text-red-400"}>
                      {user.estado}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => toggleUserStatus(user.id, user.estado)}
                      className={`px-4 py-2 rounded font-bold ${user.estado === "activo" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
                    >
                      {user.estado === "activo" ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-2 px-4 text-center" colSpan="5">No hay usuarios registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegisterUser;


