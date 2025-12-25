import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import baileImg from "../../assets/images/baile.jpeg";
import localizadoImg from "../../assets/images/localizado.jpeg";
import fitsalsaImg from "../../assets/images/fitsalsa.jpeg";
import stepImg from "../../assets/images/step.jpeg";
import fondoImg from "../../assets/images/fondo.jpeg";

import Button from "../../components/common/Button";

const Classes = () => {
  const [clases, setClases] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const navigate = useNavigate();

  const imagenes = {
    "Baile entretenido": baileImg,
    "Fit salsa": fitsalsaImg,
    "Localizado": localizadoImg,
    "Step": stepImg,
  };

  const ordenarDias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  // Fechas por semana (con offset)
  const getDatesThisWeek = (offset = 0) => {
    const chileYmd = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Santiago",
    }).format(new Date());

    const [y, m, d] = chileYmd.split("-").map(Number);
    const chileToday = new Date(y, m - 1, d);

    const dow = chileToday.getDay();
    const diffToMonday = (dow + 6) % 7;

    const monday = new Date(chileToday);
    monday.setDate(chileToday.getDate() - diffToMonday + offset * 7);

    const days = {};
    for (let i = 0; i < ordenarDias.length; i++) {
      const dt = new Date(monday);
      dt.setDate(monday.getDate() + i);

      days[ordenarDias[i]] = dt.toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }

    return days;
  };

  const fechasSemana = getDatesThisWeek(weekOffset);

  const getChileYmd = () =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Santiago",
    }).format(new Date());

  const isClassInPast = (clase) => {
    try {
      const chileYmd = getChileYmd();

      let classYmd = clase.fecha || null;

      if (!classYmd && fechasSemana[clase.dia]) {
        const [dd, mm, yyyy] = fechasSemana[clase.dia].split("-");
        classYmd = `${yyyy}-${mm}-${dd}`;
      }

      if (!classYmd) return false;

      return classYmd < chileYmd;
    } catch (e) {
      console.error("Error comparando fechas:", e);
      return false;
    }
  };

  useEffect(() => {
    const fetchClases = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/horario/");
        const data = await res.json();

        setClases(
          data
            .filter(
              (c) =>
                fechasSemana[c.dia] &&
                c.fecha ===
                  (() => {
                    const [dd, mm, yyyy] = fechasSemana[c.dia].split("-");
                    return `${yyyy}-${mm}-${dd}`;
                  })()
            )
            .sort(
              (a, b) =>
                ordenarDias.indexOf(a.dia) - ordenarDias.indexOf(b.dia)
            )
        );
      } catch (error) {
        console.error("Error al obtener clases:", error);
      }
    };

    fetchClases();
  }, [weekOffset]);

  const reservar = async (claseId) => {
    const claseObj = clases.find((c) => c.id === claseId);
    if (isClassInPast(claseObj)) {
      alert("No puedes reservar una clase que ya pasó.");
      return;
    }

    navigate("/user/checkout", { state: { clase: claseObj } });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mb-6">
        <Link
          to="/user/dashboard"
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 font-semibold"
        >
          <ArrowLeft size={20} />
          Volver al Menú Principal
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        Clases Disponibles
      </h1>

      {/* 🆕 Navegación por semanas */}
      <div className="flex justify-center gap-4 mb-8">
        <Button onClick={() => setWeekOffset(weekOffset - 1)}>
          ← Semana anterior
        </Button>
        <Button variant="secondary" onClick={() => setWeekOffset(0)}>
          Semana actual
        </Button>
        <Button onClick={() => setWeekOffset(weekOffset + 1)}>
          Semana siguiente →
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {clases.map((clase) => (
          <div
            key={clase.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden border"
          >
            <div className="bg-green-600 text-white text-center py-2 font-semibold">
              <span>{clase.dia}</span>
              <span className="block text-xs font-normal">
                {fechasSemana[clase.dia]}
              </span>
            </div>

            <img
              src={imagenes[clase.tipo] || fondoImg}
              alt={clase.tipo}
              className="w-full h-44 object-cover"
            />

            <div className="p-5">
              <h3 className="text-xl font-bold">{clase.tipo}</h3>
              <p className="text-green-600 font-medium">{clase.horario}</p>

              <p className="text-gray-500 mt-2">
                <strong>Cupos disponibles:</strong>{" "}
                {clase.cupos_disponibles}
              </p>

              {isClassInPast(clase) ? (
                <Button variant="secondary" className="w-full mt-4" disabled>
                  Clase pasada
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => reservar(clase.id)}
                  className="w-full mt-4"
                >
                  Reservar Clase
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {clases.length === 0 && (
        <p className="text-gray-500 mt-10 text-center text-lg">
          No hay clases programadas para esta semana.
        </p>
      )}
    </div>
  );
};

export default Classes;
