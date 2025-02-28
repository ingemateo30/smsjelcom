import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { login } from "../services/authService";
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff, CheckCircle } from "lucide-react";
import logo from '../assets/logos-jelcom.png';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [animateFields, setAnimateFields] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Animar la entrada de los campos después de cargar el componente
    setTimeout(() => {
      setAnimateFields(true);
    }, 100);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await login(email.trim(), password.trim());

      if (response.token) {
        if (response.estado !== "activo") {
          setError("Tu cuenta está desactivada. Contacta con el administrador.");
          setIsLoading(false);
          return;
        }
        sessionStorage.setItem("token", response.token);
        sessionStorage.setItem("role", response.role);
        navigate("/dashboard");
      } else {
        setError(response.error || "Credenciales inválidas");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      {/* Fondo con elementos decorativos */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-gray-900 to-black"></div>
      
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-orange-400/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Patrones de fondo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-orange-500/30 transition-all duration-500 transform hover:shadow-orange-500/20">
        {/* Logo y encabezado */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Jelcom Logo" className="h-16 mb-4" />
          <h2 className="text-center text-3xl font-bold mb-1">
            <span className="text-white">Bienvenido a </span>
            <span className="text-orange-500">Jelcom</span>
          </h2>
          <p className="text-center text-gray-400">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className={`relative transition-all duration-500 ${animateFields ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <label htmlFor="email" className="text-sm text-orange-400 font-medium ml-2 mb-1 block">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
              <input
                id="email"
                type="email"
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-orange-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              {email && <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />}
            </div>
          </div>

          <div className={`relative transition-all duration-500 delay-100 ${animateFields ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <label htmlFor="password" className="text-sm text-orange-400 font-medium ml-2 mb-1 block">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-12 py-3 bg-gray-800 border border-orange-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-300 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className={`transition-all duration-500 delay-200 ${animateFields ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 text-white font-bold bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 hover:from-orange-600 hover:to-orange-700 active:scale-98 transform"
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
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-lg flex items-center gap-3 animate-pulse">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className={`flex justify-between items-center text-sm pt-2 transition-all duration-500 delay-300 ${animateFields ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <Link
              to="/forgot-password"
              className="text-orange-400 hover:text-orange-300 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <Link
              to="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </form>

        {/* Footer */}
        <div className={`mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-500 transition-all duration-500 delay-300 ${animateFields ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          © {new Date().getFullYear()} Jelcom. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
};

export default Login;







