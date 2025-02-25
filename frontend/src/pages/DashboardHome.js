import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, LineChart, PieChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line, Pie, Cell, ResponsiveContainer } from 'recharts';
import { MessageSquare, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

const DashboardHome = () => {
  const [data, setData] = useState({
    stats: {},
    enviosPorHora: [],
    estadoMensajes: [],
    respuestasPacientes: [],
    smsPorDia: [],
    estadoMensajesMes: [],
    porcentajeNoContactados: [],
    rankingConfirmaciones: []
  });

  useEffect(() => {
    axios.get('http://localhost:3000/api/dashboard/stats')
      .then(response => setData(response.data))
      .catch(error => console.error("Error al obtener datos:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Dashboard
            </h2>
            <p className="text-gray-400 mt-2 text-sm">Monitoreo de recordatorios y respuestas</p>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Actualizado: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[
            { title: "Recordatorios para hoy", value: data.stats?.sms_enviados || 0, icon: MessageSquare },
            { title: "Citas Programadas", value: data.stats?.citas_programadas || 0, icon: Calendar },
            { title: "Confirmaciones", value: data.stats?.confirmaciones || 0, icon: CheckCircle },
            { title: "Cancelaciones", value: data.stats?.cancelaciones || 0, icon: XCircle }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-slate-800/50 rounded-xl shadow-xl border border-slate-700/30 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1 text-white">{stat.value}</h3>
                  </div>
                  <Icon className="w-8 h-8 text-orange-400" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Envíos por Día */}
          <div className="bg-slate-800/50 rounded-xl shadow-xl border border-slate-700/30 p-6">
            <h3 className="text-xl font-semibold text-orange-400 mb-4">SMS Enviados por Día</h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.smsPorDia.map(item => ({
                  ...item,
                  fecha: new Date(item.fecha).toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' })
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="fecha" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937' }} />
                  <Legend />
                  <Bar dataKey="enviados" fill="#F97316" name="Enviados" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>


          {/* Estado de Mensajes */}
          <div className="bg-slate-800/50 rounded-xl shadow-xl border border-slate-700/30 p-6">
            <h3 className="text-xl font-semibold text-orange-400 mb-4">Estado de Mensajes</h3>

            {data.estadoMensajes?.length > 0 ? (
              (() => {
                const formattedData = data.estadoMensajes.map(item => ({
                  ...item,
                  name: item.nombre,
                  color: item.nombre === "pendiente" ? "#F97316" : "#FB923C", // Tonos naranjas: más claro para pendiente, más oscuro para recordatorio enviado
                }));

                console.log("Formatted Data:", formattedData);

                return (

                  <PieChart width={400} height={300}>
                    <Pie
                      data={formattedData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="valor"
                      nameKey="name"
                    >
                      {formattedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} /> // Aplica colores personalizados
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937' }} />
                    <Legend />
                  </PieChart>
                );
              })()
            ) : (
              <p className="text-gray-400 text-center">No hay datos disponibles</p>
            )}
          </div>




        </div>

        {/* Ranking de Días con Más Confirmaciones */}
        <div className="bg-slate-800/50 rounded-xl shadow-xl border border-slate-700/30 p-6 mt-6 flex flex-col items-center">
          <h3 className="text-xl font-semibold text-orange-400 mb-4 text-center">
            Días con Más Confirmaciones
          </h3>
          <div className="w-full max-w-[600px]">
            <LineChart width={600} height={300} data={data.rankingConfirmaciones}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="dia" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937' }} />
              <Legend />
              <Line type="monotone" dataKey="confirmaciones" stroke="#F97316" name="Confirmaciones" />
            </LineChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
