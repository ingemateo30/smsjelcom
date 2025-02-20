import React, { useState } from "react";

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { nombre, email, password } = formData;

    if (!nombre || !email || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error en el registro");
      }

      setSuccess("Usuario registrado con éxito");
      setFormData({ nombre: "", email: "", password: "" }); // Limpiar formulario
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-white text-2xl font-bold text-center mb-4">
        Registrar Nuevo Usuario
      </h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-gray-300 block text-sm mb-1">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white focus:ring focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="text-gray-300 block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white focus:ring focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="text-gray-300 block text-sm mb-1">Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white focus:ring focus:ring-orange-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
        >
          Registrar Usuario
        </button>
      </form>
    </div>
  );
};

export default RegisterUser;
