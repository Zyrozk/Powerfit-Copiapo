import { useState, useEffect } from "react";
import { ArrowLeft, Edit2, Plus, Trash2, X } from "lucide-react";
import Button from "../../components/common/Button";

// Tipos de clase
const CLASS_TYPES = [
  "Baile entretenido",
  "Fit salsa",
  "Localizado",
  "Step",
  "Taller salsa",
  "Taller bachata",
  "Fusión Fit",
];

// Horarios permitidos
const CLASS_TIMES = [
  "09:00 - 10:20",
  "10:30 - 12:00",
  "18:00 - 19:00",
  "19:00 - 20:15",
  "20:15 - 21:10",
];

// Días de la semana
const WEEK_DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

// Formatear fecha local YYYY-MM-DD
const formatLocalDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Obtener fecha de cada día considerando semana
const getDateForDay = (dayIndex, weekOffset = 0) => {
  const today = new Date();
  const dow = today.getDay(); // 0 domingo

  const diffToMonday = (dow + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diffToMonday + weekOffset * 7);

  const target = new Date(monday);
  target.setDate(monday.getDate() + dayIndex);

  return formatLocalDate(target);
};

// Mostrar fecha local
const toLocalDateString = (ymd) => {
  if (!ymd) return "";
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-CL");
};

const ManageSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [newClass, setNewClass] = useState({ type: "", time: "" });

  // 🆕 semana actual / anterior / siguiente
  const [weekOffset, setWeekOffset] = useState(0);

  // Cargar horario
  const fetchSchedule = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/horario/");
      const data = await res.json();

      const formatted = WEEK_DAYS.map((day, index) => {
        const date = getDateForDay(index, weekOffset);
        return {
          day,
          date,
          classes: data.filter(
            (c) => c.dia === day && c.fecha === date
          ),
        };
      });

      setSchedule(formatted);
    } catch (error) {
      console.log("Error cargando horario:", error);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [weekOffset]);

  // Contraseña
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === "Gabriela") {
      setIsEditing(true);
      setShowPasswordModal(false);
      setPasswordInput("");
    } else {
      alert("Contraseña incorrecta.");
    }
  };

  // Agregar clase
  const addClassToDay = async () => {
    if (!newClass.type || !newClass.time) {
      alert("Debes seleccionar tipo y horario");
      return;
    }

    const payload = {
      dia: schedule[selectedDay].day,
      fecha: schedule[selectedDay].date,
      tipo: newClass.type,
      horario: newClass.time,
    };

    const res = await fetch("http://127.0.0.1:8000/horario/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      fetchSchedule();
      setSelectedDay(null);
      setNewClass({ type: "", time: "" });
    } else {
      alert("Error al guardar la clase");
    }
  };

  // Eliminar clase
  const deleteClass = async (id) => {
    if (!window.confirm("¿Eliminar esta clase?")) return;
    await fetch(`http://127.0.0.1:8000/horario/${id}/`, { method: "DELETE" });
    fetchSchedule();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Volver */}
        <button
          onClick={() => {
            if (isEditing) {
              setIsEditing(false);
              setSelectedDay(null);
            } else {
              window.location.href = "/coach/panel";
            }
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6"
        >
          <ArrowLeft size={20} /> Volver
        </button>

        <h1 className="text-3xl font-bold text-center mb-4">Horario Semanal</h1>

        {/* 🆕 Navegación semanas */}
        <div className="flex justify-center gap-4 mb-6">
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

        {!isEditing && (
          <div className="text-center mb-6">
            <Button
              variant="primary"
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 mx-auto"
            >
              <Edit2 size={18} /> Modificar Horario
            </Button>
          </div>
        )}

        {/* Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedule.map((day, index) => (
            <div key={index} className="bg-white p-5 rounded-2xl border shadow">
              <h2 className="font-bold">
                {day.day} — {toLocalDateString(day.date)}
              </h2>

              <div className="mt-3 space-y-2">
                {day.classes.length === 0 && (
                  <p className="text-gray-400 text-sm">Sin clases</p>
                )}

                {day.classes.map((cls) => (
                  <div
                    key={cls.id}
                    className="bg-gray-50 p-3 rounded flex justify-between"
                  >
                    <div>
                      <p className="font-semibold">{cls.tipo}</p>
                      <p className="text-sm text-gray-500">{cls.horario}</p>
                    </div>

                    {isEditing && (
                      <button
                        onClick={() => deleteClass(cls.id)}
                        className="text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <Button
                  className="w-full mt-4 flex items-center gap-2"
                  onClick={() => setSelectedDay(index)}
                >
                  <Plus size={18} /> Agregar clase
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Modal agregar */}
        {selectedDay !== null && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md">
              <div className="flex justify-between mb-4">
                <h2 className="font-bold">
                  Agregar clase — {schedule[selectedDay].day}
                </h2>
                <button onClick={() => setSelectedDay(null)}>
                  <X />
                </button>
              </div>

              <select
                className="w-full border p-2 mb-3"
                value={newClass.type}
                onChange={(e) =>
                  setNewClass({ ...newClass, type: e.target.value })
                }
              >
                <option value="">Tipo de clase</option>
                {CLASS_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>

              <select
                className="w-full border p-2 mb-4"
                value={newClass.time}
                onChange={(e) =>
                  setNewClass({ ...newClass, time: e.target.value })
                }
              >
                <option value="">Horario</option>
                {CLASS_TIMES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>

              <Button variant="primary" className="w-full" onClick={addClassToDay}>
                Guardar clase
              </Button>
            </div>
          </div>
        )}

        {/* Modal contraseña */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl w-full max-w-sm">
              <h2 className="font-bold mb-4">Contraseña</h2>
              <form onSubmit={handlePasswordSubmit}>
                <input
                  type="password"
                  className="w-full border p-3 mb-4"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
                <Button type="submit" className="w-full">
                  Confirmar
                </Button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageSchedule;
