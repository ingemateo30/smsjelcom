/*
import { useEffect, useState } from "react";
import { getResponses } from "../services/whatsappService";
import { MessageSquare, Calendar, User, Phone, Info, Loader2 } from "lucide-react";

const ResponsesList = () => {
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("No tienes un token de autenticación. Inicia sesión nuevamente.");
          window.location.href = "/login";
          return;
        }
        
        const data = await getResponses();
        setResponses(data);
      } catch (error) {
        console.error("Error obteniendo respuestas:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          setError("Sesión expirada. Redirigiendo al login...");
        } else {
          setError("Error al cargar las respuestas. Intenta nuevamente.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchResponses();
  }, []);

  const getStatusColor = (respuesta) => {
    const resp = respuesta.toLowerCase();
    if (resp.includes("confirmo") || resp.includes("sí") || resp.includes("si")) {
      return "bg-green-500/10 text-green-400 border-green-500/20";
    } else if (resp.includes("cancel") || resp.includes("no puedo")) {
      return "bg-red-500/10 text-red-400 border-red-500/20";
    } else {
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="w-full bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-700/30 p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Respuestas de Pacientes
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            Confirmaciones y cancelaciones de citas médicas
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-10 h-10 text-orange-400 animate-spin" />
            <span className="ml-3 text-orange-300">Cargando respuestas...</span>
          </div>
        ) : error ? (
          <div className="p-4 rounded-lg flex items-center gap-3 border bg-red-500/10 border-red-500/20 text-red-400">
            <Info className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        ) : (
          <>
            {responses.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto text-orange-400 mb-3" />
                <p>No hay respuestas registradas aún</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700/50 text-left">
                      <th className="px-4 py-3 text-gray-400 font-medium">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          Teléfono
                        </div>
                      </th>
                      <th className="px-4 py-3 text-gray-400 font-medium">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Paciente
                        </div>
                      </th>
                      <th className="px-4 py-3 text-gray-400 font-medium">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Fecha Cita
                        </div>
                      </th>
                      <th className="px-4 py-3 text-gray-400 font-medium">
                        <div className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Respuesta
                        </div>
                      </th>
                      <th className="px-4 py-3 text-gray-400 font-medium">
                        <div className="flex items-center">
                          <Info className="w-4 h-4 mr-2" />
                          Motivo
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {responses.map((response) => (
                      <tr key={response.id} className="hover:bg-slate-700/10 transition-colors">
                        <td className="px-4 py-4 text-gray-300">{response.telefono}</td>
                        <td className="px-4 py-4 text-gray-300">{response.nombre_paciente}</td>
                        <td className="px-4 py-4 text-gray-300">{response.fecha_cita}</td>
                        <td className="px-4 py-4">
                          <span className={`py-1 px-3 rounded-full text-sm font-medium ${getStatusColor(response.respuesta)}`}>
                            {response.respuesta}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gray-300">
                          {response.motivo ? response.motivo : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResponsesList;*/