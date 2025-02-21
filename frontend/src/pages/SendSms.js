import { useState, useEffect } from "react";
import { sendReminderSMS } from "../services/smsService";
import { MessageCircle, Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react";

const SendSMS = () => {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [smsStatus, setSMSStatus] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {

        const interval = setInterval(() => {
            setTimeLeft(prev => (prev && prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleSendSMS = async () => {
        setLoading(true);
        try {
            const result = await sendReminderSMS();

            if (result.message) {
                setResponse({
                    success: true,
                    message: result.message,
                    data: result
                });
            } else {
                setResponse({
                    success: true,
                    message: "sms enviados con éxito",
                    data: result
                });
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);

            if (error.response && error.response.data && error.response.data.message) {
                setResponse({ success: false, message: error.response.data.message });
            } else {
                setResponse({ success: false, message: "Error al enviar sms" });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (response) {
            const timer = setTimeout(() => setResponse(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [response]);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${hours}h ${minutes}m ${secs}s`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-700/30 p-8">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                        Enviar Recordatorios SMS
                    </h2>
                    <p className="text-gray-400 mt-2 text-sm">Envía recordatorios automáticos por SMS a los clientes.</p>
                </div>
                <button
                    onClick={handleSendSMS}
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
                            <MessageCircle className="w-5 h-5" />
                            Enviar SMS
                        </>
                    )}
                </button>
                {response && (
                    <div className={`p-4 mt-4 rounded-lg flex items-center gap-3 border ${response.success
                        ? "bg-green-500/10 border-green-500/20 text-green-400"
                        : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                        {response.success ? (
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        )}
                        <span className="text-sm">{response.message}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SendSMS;
