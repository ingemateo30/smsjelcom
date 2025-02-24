import React, { useState, useEffect } from "react";

const RegisterUser = () => {
  const [formData, setFormData] = useState({ nombre: "", email: "", password: "" });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUnauthorized = (response) => {
    if (response.status === 401) {
      console.warn("Token expirado. Cerrando sesión...");
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirigir al login
      throw new Error("Sesión expirada. Redirigiendo al login...");
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No tienes un token de autenticación. Inicia sesión.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/auth/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });

      handleUnauthorized(response); // Verifica si el token ha expirado

      if (!response.ok) throw new Error("Error al obtener usuarios");

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
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
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      handleUnauthorized(response); // Verifica si el token ha expirado

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error en el registro");

      setSuccess("Usuario registrado con éxito");
      setFormData({ nombre: "", email: "", password: "" });
      fetchUsers();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const toggleUserStatus = async (id, estado) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No tienes un token de autenticación. Inicia sesión.");
      return;
    }

    try {
      const nuevoEstado = estado === "activo" ? "inactivo" : "activo";
      const response = await fetch(`http://localhost:3000/api/auth/usuarios/${id}/estado`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      handleUnauthorized(response); // Verifica si el token ha expirado

      if (!response.ok) throw new Error("Error al actualizar el estado del usuario");

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === id ? { ...user, estado: nuevoEstado } : user))
      );
    } catch (error) {
      setError(error.message);
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
            <tr className="bg-gray-900 text-left">
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


