import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { login } from "../services/authService"; // Importamos la función de login
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await login(email.trim(), password.trim());

      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.role); // Guardamos el rol

        navigate("/dashboard"); // Redirigir si el login es exitoso
      } else {
        setError(response.error || "Credenciales inválidas"); // Manejo de error
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Fondo con efecto de iluminación */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-black opacity-90"></div>

      {/* Contenedor del login */}
      <div className="relative z-10 w-full max-w-md p-8 bg-black/40 backdrop-blur-md rounded-2xl shadow-lg border border-orange-500/50">
        
        <h2 className="text-center text-3xl font-bold text-orange-400 mb-4">
          Bienvenido a Jelcom
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Ingresa tus credenciales para continuar
        </p>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Input Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 bg-orange-500/10 backdrop-blur-md border border-orange-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Input Contraseña */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 bg-orange-500/10 backdrop-blur-md border border-orange-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Botón de Login */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-white font-bold bg-orange-500 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-orange-500/50 hover:scale-105 active:scale-95"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
                <span>Ingresando...</span>
              </div>
            ) : (
              <>
                <span>Ingresar</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Mensaje de error */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Recuperar contraseña */}
          <div className="text-center">
  <Link
    to="/forgot-password"
    className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
  >
    ¿Olvidaste tu contraseña?
  </Link>
</div>

        </form>
      </div>
    </div>
  );
};

export default Login;


