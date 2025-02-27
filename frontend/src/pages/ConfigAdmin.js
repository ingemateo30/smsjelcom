import React, { useEffect, useState } from "react";
import { getAllConfigs, updateConfig } from "../services/configService";
import { Loader2, Save, AlertCircle, CheckCircle } from "lucide-react";

const ConfigAdmin = () => {
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [updatingKey, setUpdatingKey] = useState(null);

    useEffect(() => {
        const fetchConfigs = async () => {
            try {
                const data = await getAllConfigs();
                setConfigs(data);
            } catch (error) {
                setMessage("Error cargando configuraciones");
            } finally {
                setLoading(false);
            }
        };
        fetchConfigs();
    }, []);

    const handleUpdate = async (key, value) => {
        setUpdatingKey(key);
        try {
            await updateConfig(key, value);
            setMessage("Configuración actualizada con éxito");
        } catch (error) {
            setMessage("Error al actualizar configuración");
        } finally {
            setUpdatingKey(null);
            setTimeout(() => {
                setMessage("");
            }, 4000);
        }
    };
    
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-700/30 p-8">
                <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                    Administración de Configuraciones
                </h2>

                {message && (
                    <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 border ${
                        message.toLowerCase().includes("éxito")
                            ? "bg-green-500/10 border-green-500/20 text-green-400"
                            : "bg-red-500/10 border-red-500/20 text-red-400"
                    }`}>
                        {message.toLowerCase().includes("éxito") ? (
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        )}
                        <span className="text-sm">{message}</span>
                    </div>
                )}

                <div className="mt-6 space-y-4">
                    {configs.map((config) => (
                        <div key={config.clave} className="flex items-center gap-4 bg-slate-700/30 p-4 rounded-lg">
                            <span className="text-gray-300 font-medium w-1/3">{config.clave}</span>
                            <input
                                type="text"
                                value={config.valor}
                                onChange={(e) => setConfigs(configs.map((c) =>
                                    c.clave === config.clave ? { ...c, valor: e.target.value } : c))}
                                className="w-full bg-transparent border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <button
                                onClick={() => handleUpdate(config.clave, config.valor)}
                                disabled={updatingKey === config.clave}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 px-4 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {updatingKey === config.clave ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                Guardar
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ConfigAdmin;

