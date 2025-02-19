import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:3000/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            setMessage("Error al enviar la solicitud.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            {/* Fondo con efecto de iluminación */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-black opacity-90"></div>

            {/* Contenedor principal */}
            <div className="relative z-10 w-full max-w-md p-8 bg-black/40 backdrop-blur-md rounded-2xl shadow-lg border border-orange-500/50">
                
                {/* Encabezado */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-orange-400 mb-2">
                        Recuperar Contraseña
                    </h2>
                    <p className="text-gray-300">Ingresa tu correo para restablecer tu contraseña</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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

                    {/* Botón de enviar */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 text-white font-bold bg-orange-500 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-orange-500/50 hover:scale-105 active:scale-95"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
                                <span>Enviando...</span>
                            </div>
                        ) : (
                            <>
                                <span>Enviar enlace</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    {/* Mensajes de estado */}
                    {message && (
                        <div className={`p-4 rounded-lg flex items-center gap-3 ${
                            message.toLowerCase().includes("éxito") 
                            ? "bg-green-500/10 border border-green-500/20" 
                            : "bg-red-500/10 border border-red-500/20"
                        }`}>
                            {message.toLowerCase().includes("éxito") ? (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-400" />
                            )}
                            <p className={`text-sm ${
                                message.toLowerCase().includes("éxito") 
                                ? "text-green-400" 
                                : "text-red-400"
                            }`}>{message}</p>
                        </div>
                    )}

                    {/* Enlace de regreso */}
                    <div className="text-center">
                        <Link 
                            to="/login"
                            className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                        >
                            ← Volver al inicio de sesión
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
