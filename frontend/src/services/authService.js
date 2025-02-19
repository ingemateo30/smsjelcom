import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });

    console.log("Respuesta del servidor:", response.data);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("rol", response.data.rol);
    }

    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || "Error en la autenticación" };
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("rol"); // Eliminar el rol al cerrar sesión
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUserRole = () => {
  return localStorage.getItem("rol") || null; // Obtener el rol almacenado
};

