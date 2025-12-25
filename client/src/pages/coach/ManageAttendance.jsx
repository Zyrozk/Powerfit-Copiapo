import { useEffect, useState } from "react";
import { ArrowLeft, ClipboardCheck, Users, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManageAttendance = () => {
  const [clases, setClases] = useState([]);
  const [asistentes, setAsistentes] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState(null);
  const [loadingClases, setLoadingClases] = useState(false);
  const [loadingAsistentes, setLoadingAsistentes] = useState(false);

  const navigate = useNavigate();

  // 🔹 Fecha seleccionada (por defecto hoy, formato YYYY-MM-DD)
  const hoy = new Date().toISOString().split("T")[0];
  const [fechaSeleccionada, setFechaSeleccionada] = useState(hoy);

  // 🔹 Abrir QR
  const abrirQR = (clase) => {
    navigate("/coach/attendance-qr", {
      state: { clase },
    });
  };

  // 🔹 Cargar clases por fecha
  const fetchClasesPorFecha = async (fecha) => {
    setLoadingClases(true);
    setClaseSeleccionada(null);
    setAsistentes([]);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/clases-por-fecha/?fecha=${fecha}`
      );
      const data = await res.json();
      setClases(data);
    } catch (err) {
      console.error("Error al cargar clases:", err);
      alert("No se pudo conectar al servidor.");
    }

    setLoadingClases(false);
  };

  // 🔹 Cargar asistentes
  const fetchAsistentes = async (claseId) => {
    setClaseSeleccionada(claseId);
    setLoadingAsistentes(true);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/asistentes/${claseId}/`
      );
      const data = await res.json();
      setAsistentes(data);
    } catch (err) {
      alert("No se pudo cargar asistentes.");
    }

    setLoadingAsistentes(false);
  };

  // 🔹 Marcar presente manual
  const marcarPresente = async (reservaId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/asistencia/${reservaId}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ presente: true }),
        }
      );

      if (res.ok) {
        setAsistentes((prev) =>
          prev.map((a) =>
            a.id === reservaId ? { ...a, presente: true } : a
          )
        );
      }
    } catch {
      alert("No se pudo marcar asistencia.");
    }
  };

  // 🔹 Cargar al iniciar
  useEffect(() => {
    fetchClasesPorFecha(fechaSeleccionada);
  }, [fechaSeleccionada]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Volver */}
      <button
        onClick={() => navigate("/coach/panel")}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium mb-6"
      >
        <ArrowLeft size={20} />
        Volver al Panel
      </button>

      {/* Título */}
      <h1 className="text-3xl font-bold flex items-center gap-3 mb-6">
        <ClipboardCheck className="text-green-600" />
        Control de Asistencia
      </h1>

      {/* 📅 Selector de fecha */}
      <div className="bg-white p-4 rounded-xl border shadow-sm mb-6 flex items-center gap-4">
        <Calendar className="text-green-600" />
        <input
          type="date"
          value={fechaSeleccionada}
          onChange={(e) => setFechaSeleccionada(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />
      </div>

      {/* === CLASES === */}
      <div className="bg-white p-6 rounded-2xl shadow-md border mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Users className="text-green-600" />
          Clases del Día
        </h2>

        {loadingClases ? (
          <p className="text-gray-500">Cargando clases...</p>
        ) : clases.length === 0 ? (
          <p className="text-gray-500">
            No hay clases programadas para esta fecha.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clases.map((clase) => (
              <div
                key={clase.id}
                className={`p-4 rounded-xl border shadow-sm ${
                  claseSeleccionada === clase.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <p className="font-semibold">{clase.tipo}</p>
                <p className="text-sm text-gray-600 mb-3">
                  {clase.horario}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => fetchAsistentes(clase.id)}
                    className="px-3 py-2 text-sm bg-gray-100 rounded-lg"
                  >
                    Ver asistentes
                  </button>

                  <button
                    onClick={() => abrirQR(clase)}
                    className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg"
                  >
                    Abrir QR
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* === ASISTENTES === */}
      {claseSeleccionada && (
        <div className="bg-white p-6 rounded-2xl shadow-md border">
          <h2 className="text-xl font-bold mb-4">
            Asistentes de la Clase
          </h2>

          {loadingAsistentes ? (
            <p className="text-gray-500">Cargando asistentes...</p>
          ) : asistentes.length === 0 ? (
            <p className="text-gray-500">Ningún alumno inscrito.</p>
          ) : (
            <div className="space-y-3">
              {asistentes.map((st) => (
                <div
                  key={st.id}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <span>
                    {st.nombre} {st.apellido}
                  </span>

                  {st.presente ? (
                    <span className="text-green-600 font-semibold">
                      Presente ✔
                    </span>
                  ) : (
                    <button
                      onClick={() => marcarPresente(st.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg"
                    >
                      Marcar Presente
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageAttendance;
