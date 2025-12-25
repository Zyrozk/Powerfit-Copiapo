import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import Button from "../../components/common/Button";

const API_URL = "http://127.0.0.1:8000";

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // -------------------------------
  // Formateador de dinero
  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price);
  };

  // -------------------------------
  // Cargar pagos desde backend
  const fetchPayments = async () => {
    try {
      let url = `${API_URL}/pagos/`;

      if (fechaInicio && fechaFin) {
        url += `?inicio=${fechaInicio}&fin=${fechaFin}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setPayments(data);
    } catch (error) {
      console.log("Error cargando pagos:", error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // -------------------------------
  // Exportar Excel
  const exportExcel = () => {
    let url = `${API_URL}/pagos/exportar/`;

    if (fechaInicio && fechaFin) {
      url += `?inicio=${fechaInicio}&fin=${fechaFin}`;
    }

    window.open(url, "_blank");
  };

  // -------------------------------
  // Colores según estado del pago
  const getStatusStyle = (status) => {
    if (status === "Realizado") return "bg-green-100 text-green-700 border-green-300";
    if (status === "Rechazado") return "bg-red-100 text-red-700 border-red-300";
    return "bg-gray-100 text-gray-600 border-gray-300"; // Pendiente
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Botón Volver */}
        <div className="mb-6">
          <Link
            to="/coach/panel"
            className="flex items-center gap-2 text-gray-600 hover:text-green-500 font-medium w-fit"
          >
            <ArrowLeft size={20} /> Volver al Panel
          </Link>
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Pagos</h1>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
          <h3 className="text-lg font-bold mb-4">Filtrar por fecha</h3>

          <div className="flex flex-col lg:flex-row gap-4 items-end">

            <div className="w-full lg:flex-1">
              <label className="block text-xs font-bold text-gray-500 mb-1">Fecha inicio</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="w-full lg:flex-1">
              <label className="block text-xs font-bold text-gray-500 mb-1">Fecha fin</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={fetchPayments} variant="primary">
                Filtrar
              </Button>

              <button
                onClick={exportExcel}
                className="px-6 py-2 rounded-full font-semibold border border-green-500 text-green-500 hover:bg-green-50 flex items-center gap-2"
              >
                <Download size={18} /> Exportar
              </button>
            </div>

          </div>
        </div>

        {/* Lista de Pagos */}
        <div className="space-y-4">
          {payments.length === 0 && (
            <p className="text-center text-gray-500">No hay pagos registrados.</p>
          )}

          {payments.map((pay) => (
            <div
              key={pay.id}
              className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold">{pay.usuario_nombre}</h3>
                  <p className="text-sm text-gray-400">{pay.tipo}</p>
                </div>

                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusStyle(pay.estado)}`}>
                  {pay.estado}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <span className="text-xs text-gray-400 font-bold">Monto</span>
                  <p className="text-lg font-bold">{formatPrice(pay.monto)}</p>
                </div>

                <div>
                  <span className="text-xs text-gray-400 font-bold">Método</span>
                  <p className="text-lg font-bold">{pay.metodo}</p>
                </div>

                <div>
                  <span className="text-xs text-gray-400 font-bold">Fecha</span>
                  <p className="text-lg font-bold">{pay.fecha}</p>
                </div>

                <div>
                  <span className="text-xs text-gray-400 font-bold">Hora</span>
                  <p className="text-lg font-bold">{pay.hora}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ManagePayments;
