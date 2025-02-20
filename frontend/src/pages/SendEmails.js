import { useState, useEffect } from "react";
import { sendReminderEmails, getCronStatus } from "../services/emailService";
import { Mail, Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react";

const SendEmails = () => {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [cronStatus, setCronStatus] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        const fetchCronStatus = async () => {
            try {
                const status = await getCronStatus();
                setCronStatus(status);

                if (status && typeof status.timeLeftInSeconds === "number") {
                    setTimeLeft(status.timeLeftInSeconds);
                }
            } catch (error) {
                console.error("Error obteniendo el estado del cron:", error);
                setCronStatus(null);
            }
        };

        fetchCronStatus();

        const interval = setInterval(() => {
            setTimeLeft(prev => (prev && prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleSendEmails = async () => {
        setLoading(true);
        try {
            const result = await sendReminderEmails();
            setResponse({ success: true, message: "Correos enviados con éxito", data: result });
        } catch (error) {
            setResponse({ success: false, message: "Error al enviar correos" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-700/30 p-8">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                        Enviar Recordatorios
                    </h2>
                    <p className="text-gray-400 mt-2 text-sm">
                        Envía recordatorios automáticos por correo a los clientes.
                    </p>
                </div>

                <button
                    onClick={handleSendEmails}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3.5 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Enviando...
                        </>
                    ) : (
                        <>
                            <Mail className="w-5 h-5" />
                            Enviar Correos
                        </>
                    )}
                </button>

                {response && (
                    <div className={`p-4 mt-4 rounded-lg flex items-center gap-3 border ${
                        response.success
                            ? "bg-green-500/10 border-green-500/20 text-green-400"
                            : "bg-red-500/10 border-red-500/20 text-red-400"
                    }`}>
                        {response.success ? (
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        )}
                        <span className="text-sm">{response.message}</span>
                    </div>
                )}

                {cronStatus && (
                    <div className="mt-4 p-4 rounded-lg bg-gray-800 text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-orange-400" />
                        <span className="text-sm">
                            Estado del cron: <strong>{cronStatus.message}</strong>
                        </span>
                        {timeLeft !== null && (
                            <span className="text-sm ml-2">
                                ⏳ Próxima ejecución en: <strong>{timeLeft} segundos</strong>
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SendEmails;


