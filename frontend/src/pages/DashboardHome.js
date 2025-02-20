import React from 'react';
import { BarChart, LineChart, PieChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line, Pie, Cell } from 'recharts';
import { MessageSquare, Calendar, CheckCircle, XCircle, Clock, Users, Bell, PhoneCall } from 'lucide-react';

const mockData = {
  stats: [
    {
      title: "SMS Enviados Hoy",
      value: "124",
      change: "+15.2%",
      icon: MessageSquare,
      color: "text-orange-400"
    },
    {
      title: "Citas Programadas",
      value: "45",
      change: "+8.5%",
      icon: Calendar,
      color: "text-orange-400"
    },
    {
      title: "Confirmaciones",
      value: "38",
      change: "+12.3%",
      icon: CheckCircle,
      color: "text-orange-400"
    },
    {
      title: "Cancelaciones",
      value: "7",
      change: "-2.1%",
      icon: XCircle,
      color: "text-orange-400"
    }
  ],
  enviosPorHora: [
    { hora: '8:00', enviados: 15, entregados: 14 },
    { hora: '9:00', enviados: 25, entregados: 23 },
    { hora: '10:00', enviados: 30, entregados: 28 },
    { hora: '11:00', enviados: 20, entregados: 19 },
    { hora: '12:00', enviados: 18, entregados: 17 },
    { hora: '13:00', enviados: 22, entregados: 21 }
  ],
  estadoMensajes: [
    { nombre: 'Entregados', valor: 85, color: '#F97316' },
    { nombre: 'Pendientes', valor: 10, color: '#FB923C' },
    { nombre: 'Fallidos', valor: 5, color: '#FDBA74' }
  ],
  respuestasPacientes: [
    { mes: 'Ene', confirmados: 180, cancelados: 20 },
    { mes: 'Feb', confirmados: 200, cancelados: 15 },
    { mes: 'Mar', confirmados: 220, cancelados: 25 },
    { mes: 'Abr', confirmados: 240, cancelados: 18 },
    { mes: 'May', confirmados: 260, cancelados: 22 },
    { mes: 'Jun', confirmados: 280, cancelados: 20 }
  ]
};

const DashboardHome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Dashboard SMS
            </h2>
            <p className="text-gray-400 mt-2 text-sm">
              Monitoreo de recordatorios y respuestas
            </p>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Actualizado: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {mockData.stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-slate-800/50 backdrop-blur-lg rounded-xl shadow-xl border border-slate-700/30 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1 text-white">{stat.value}</h3>
                    <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'} flex items-center gap-1 mt-1`}>
                      {stat.change}
                    </span>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl shadow-xl border border-slate-700/30 p-6">
            <h3 className="text-xl font-semibold text-orange-400 mb-4">Envíos por Hora</h3>
            <div className="h-80">
              <LineChart
                width={500}
                height={300}
                data={mockData.enviosPorHora}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hora" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                <Legend />
                <Line type="monotone" dataKey="enviados" stroke="#F97316" name="SMS Enviados" />
                <Line type="monotone" dataKey="entregados" stroke="#FB923C" name="SMS Entregados" />
              </LineChart>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl shadow-xl border border-slate-700/30 p-6">
            <h3 className="text-xl font-semibold text-orange-400 mb-4">Respuestas de Pacientes</h3>
            <div className="h-80">
              <BarChart
                width={500}
                height={300}
                data={mockData.respuestasPacientes}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="mes" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                <Legend />
                <Bar dataKey="confirmados" fill="#F97316" name="Confirmadas" />
                <Bar dataKey="cancelados" fill="#FB923C" name="Canceladas" />
              </BarChart>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl shadow-xl border border-slate-700/30 p-6">
            <h3 className="text-xl font-semibold text-orange-400 mb-4">Estado de Mensajes</h3>
            <div className="h-80 flex justify-center">
              <PieChart width={400} height={300}>
                <Pie
                  data={mockData.estadoMensajes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="valor"
                  label
                >
                  {mockData.estadoMensajes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                <Legend />
              </PieChart>
            </div>
          </div>

          {/* Últimos Recordatorios */}
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl shadow-xl border border-slate-700/30 p-6">
            <h3 className="text-xl font-semibold text-orange-400 mb-4">Últimos Recordatorios</h3>
            <div className="space-y-4">
              {[
                { paciente: "Juan Pérez", hora: "15:30", estado: "Confirmado", telefono: "+1234567890" },
                { paciente: "María García", hora: "16:00", estado: "Pendiente", telefono: "+1234567891" },
                { paciente: "Carlos López", hora: "16:30", estado: "Cancelado", telefono: "+1234567892" },
                { paciente: "Ana Martínez", hora: "17:00", estado: "Confirmado", telefono: "+1234567893" }
              ].map((recordatorio, index) => (
                <div key={index} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        recordatorio.estado === "Confirmado" ? "bg-green-400" :
                        recordatorio.estado === "Pendiente" ? "bg-orange-400" : "bg-red-400"
                      }`} />
                      <div>
                        <p className="font-medium text-white">{recordatorio.paciente}</p>
                        <p className="text-sm text-gray-400">{recordatorio.telefono}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-orange-400">{recordatorio.hora}</p>
                      <p className="text-sm text-gray-400">{recordatorio.estado}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;