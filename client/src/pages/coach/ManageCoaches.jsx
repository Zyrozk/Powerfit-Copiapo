import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";

const ManageCoaches = () => {
  const [coaches, setCoaches] = useState([]);
  const navigate = useNavigate();

  // ***** CARGAR COACHES DESDE DJANGO *****
  const fetchCoaches = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/coaches/");
      const data = await res.json();
      setCoaches(data);
    } catch (error) {
      console.error("Error cargando coaches:", error);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  // ***** ELIMINAR COACH *****
  const handleDelete = async (id, nombre, apellido) => {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar al coach ${nombre} ${apellido}? Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/coaches/${id}/`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Coach eliminado correctamente.");
        setCoaches(coaches.filter((c) => c.id !== id));
      } else {
        alert("Error al eliminar el coach.");
      }
    } catch (error) {
      alert("No se pudo conectar al servidor.");
    }
  };

  // ***** EDITAR COACH (con confirmación) *****
  const handleEdit = (coach) => {
    const confirmar = window.confirm(
      `¿Deseas editar al coach ${coach.nombre} ${coach.apellido}?`
    );
    if (confirmar) {
      navigate(`/coach/edit/${coach.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* BOTÓN VOLVER */}
        <div className="mb-4">
          <Link
            to="/coach/panel"
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 font-medium"
          >
            <ArrowLeft size={20} />
            Volver
          </Link>
        </div>

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Administrar Coaches</h1>

          <Link
            to="/coach/create"
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <Plus size={20} />
            Nuevo Coach
          </Link>
        </div>

        {/* LISTA DE COACHES */}
        {coaches.length === 0 ? (
          <p className="text-gray-500">No hay coaches registrados.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coaches.map((coach) => (
              <div
                key={coach.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition"
              >
                {/* HEADER DE TARJETA */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {coach.nombre} {coach.apellido}
                    </h2>
                    <p className="text-gray-500 text-sm">{coach.correo}</p>
                  </div>

                  <div className="flex gap-3">
                    {/* EDITAR (VERDE) */}
                    <button
                      className="text-green-600 hover:text-green-700"
                      onClick={() => handleEdit(coach)}
                    >
                      <Edit size={20} />
                    </button>

                    {/* ELIMINAR (ROJO) */}
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={() =>
                        handleDelete(coach.id, coach.nombre, coach.apellido)
                      }
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* BIOGRAFÍA */}
                <p className="mt-4 text-gray-700 leading-relaxed">
                  {coach.bibliografia}
                </p>

                {/* ESPECIALIDADES (TAGS) */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {(coach.especialidad || "")
                    .split(",")
                    .map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full border border-gray-200"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCoaches;
