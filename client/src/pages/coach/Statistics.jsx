import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, BarChart3, Users, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const COLORS = ["#22c55e", "#16a34a", "#4ade80", "#86efac", "#15803d"];
const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

const Statistics = () => {
  const navigate = useNavigate();
  const [selectedRange, setSelectedRange] = useState("month");

  const [membresiasData, setMembresiasData] = useState([]);
  const [asistenciaData, setAsistenciaData] = useState([]);
  const [pagosData, setPagosData] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/estadisticas/membresias/?range=${selectedRange}`)
      .then((r) => r.json())
      .then(setMembresiasData)
      .catch((e) => console.error("Error membresías:", e));
  }, [selectedRange]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/estadisticas/asistencia/?range=${selectedRange}`)
      .then((r) => r.json())
      .then(setAsistenciaData)
      .catch((e) => console.error("Error asistencia:", e));
  }, [selectedRange]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/estadisticas/pagos/?range=${selectedRange}`)
      .then((r) => r.json())
      .then(setPagosData)
      .catch((e) => console.error("Error pagos:", e));
  }, [selectedRange]);

  const membresiasChartData = useMemo(() => {
    return (membresiasData || []).map((m) => ({
      mes: MESES[(m.start_date__month || 1) - 1] || `Mes ${m.start_date__month}`,
      total: m.total || 0,
    }));
  }, [membresiasData]);

  const asistenciaChartData = useMemo(() => {
    return (asistenciaData || []).map((a) => ({
      name: a.clase,
      value: a.porcentaje,
    }));
  }, [asistenciaData]);

  const pagosChartData = useMemo(() => {
    return (pagosData || []).map((p) => ({
      mes: MESES[(p.fecha__month || 1) - 1] || `Mes ${p.fecha__month}`,
      total: p.total || 0,
    }));
  }, [pagosData]);

  return (
    <main className="min-h-screen bg-gray-50 px-8 py-6">
      <button
        onClick={() => navigate("/coach/panel")}
        className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6"
      >
        <ArrowLeft size={20} /> Volver
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BarChart3 className="text-green-600" />
          Panel de Estadísticas
        </h1>
        <p className="text-gray-500 mt-2 max-w-2xl">
          Indicadores clave para apoyar la toma de decisiones de la administración del gimnasio.
        </p>
      </div>

      {/* ✅ FILTRO RESTAURADO */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-10">
        <h3 className="text-sm font-bold text-gray-700 mb-3">
          Filtrar por período
        </h3>

        <div className="flex flex-wrap gap-3">
          {[
            { label: "Último día", value: "day" },
            { label: "Última semana", value: "week" },
            { label: "Último mes", value: "month" },
            { label: "Últimos 6 meses", value: "6months" },
            { label: "Último año", value: "year" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedRange(opt.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition
                ${
                  selectedRange === opt.value
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Membresías */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <Users className="text-green-500" /> Membresías nuevas
          </h2>

          {membresiasChartData.length === 0 ? (
            <p className="text-gray-400 text-sm">No hay datos</p>
          ) : (
            <ResponsiveContainer height={220}>
              <BarChart data={membresiasChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Asistencia */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <Users className="text-green-500" /> Asistencia por clase
          </h2>

          {asistenciaChartData.length === 0 ? (
            <p className="text-gray-400 text-sm">No hay datos</p>
          ) : (
            <ResponsiveContainer height={220}>
              <PieChart>
                <Pie
                  data={asistenciaChartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  label
                >
                  {asistenciaChartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pagos */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <CreditCard className="text-green-500" /> Pagos por mes
          </h2>

          {pagosChartData.length === 0 ? (
            <p className="text-gray-400 text-sm">No hay datos</p>
          ) : (
            <ResponsiveContainer height={220}>
              <LineChart data={pagosChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>
    </main>
  );
};

export default Statistics;
