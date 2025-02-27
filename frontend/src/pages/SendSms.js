import { useState, useEffect } from "react";
import { sendReminderSMS, getSMSBalance } from "../services/smsService";
import { MessageCircle, Loader2, CheckCircle, AlertCircle } from "lucide-react";

const SendSMS = () => {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [balance, setBalance] = useState(null);
    const [errorBalance, setErrorBalance] = useState(false);

    useEffect(() => {
        const fetchBalance = async () => {
            const result = await getSMSBalance();

            if (result.success) {
                setBalance(result.balance);
                setErrorBalance(false);
            } else {
                setBalance(0);
                setErrorBalance(true);
            }
        };

        fetchBalance();
    }, []);

    const handleSendSMS = async () => {
        if (balance === 0) return;

        setLoading(true);
        try {
            const result = await sendReminderSMS();
            setResponse({ success: true, message: result.message || "SMS enviados con éxito" });
            const updatedBalance = await getSMSBalance();
            setBalance(updatedBalance.balance);

        } catch (error) {
            setResponse({ success: false, message: "Error al enviar SMS" });
        } finally {
            setLoading(false);
        }
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

                {/* Mostrar el saldo disponible */}
                <div className={`mb-4 text-center text-lg font-medium ${errorBalance ? "text-red-400" : "text-orange-400"}`}>
                    {errorBalance ? "Error al obtener saldo" : `Saldo disponible: ${balance} SMS`}
                </div>

                {/* Mostrar mensaje de saldo insuficiente */}
                {balance === 0 && (
                    <div className="text-sm text-red-400 text-center mb-4">
                        Saldo insuficiente para enviar SMS.
                    </div>
                )}

                <button
                    onClick={handleSendSMS}
                    disabled={loading || balance === 0 || errorBalance}
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

