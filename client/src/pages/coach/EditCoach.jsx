import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, User, FileText, Stars } from "lucide-react";

const EditCoach = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    password: "",
    bibliografia: "",
    especialidad: "",
  });

  // *** Cargar datos del coach ***
  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/coaches/${id}/`);
        const data = await res.json();

        if (res.ok) {
          setFormData(data);
        } else {
          alert("Coach no encontrado.");
          navigate("/coach/coaches");
        }
      } catch (error) {
        alert("No se pudo conectar al servidor.");
      }
    };

    fetchCoach();
  }, [id, navigate]);

  // *** Guardar cambios ***
  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmar = window.confirm(
      `¿Guardar los cambios del coach ${formData.nombre} ${formData.apellido}?`
    );
    if (!confirmar) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/coaches/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Coach actualizado correctamente.");
        navigate("/coach/coaches");
      } else {
        alert("Error al actualizar el coach.");
      }
    } catch (error) {
      alert("No se pudo conectar al servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-2 mb-6">
          <Link
            to="/coach/coaches"
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 font-medium"
          >
            <ArrowLeft size={20} />
            Volver
          </Link>
        </div>

        {/* CARD PRINCIPAL */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Editar Coach
          </h1>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Nombre */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Nombre
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full pl-10 p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            {/* Apellido */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Apellido
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) =>
                    setFormData({ ...formData, apellido: e.target.value })
                  }
                  className="w-full pl-10 p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            {/* Correo */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={formData.correo}
                onChange={(e) =>
                  setFormData({ ...formData, correo: e.target.value })
                }
                className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* Password */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Contraseña
              </label>
              <input
                type="text"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* Biografía */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Biografía
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                <textarea
                  rows={4}
                  value={formData.bibliografia}
                  onChange={(e) =>
                    setFormData({ ...formData, bibliografia: e.target.value })
                  }
                  className="w-full pl-10 p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                ></textarea>
              </div>
            </div>

            {/* Especialidad */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Especialidades
              </label>
              <div className="relative">
                <Stars className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Ej: Baile entretenido, Fit Salsa, Localizado"
                  value={formData.especialidad}
                  onChange={(e) =>
                    setFormData({ ...formData, especialidad: e.target.value })
                  }
                  className="w-full pl-10 p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            {/* SUBMIT */}
            <div className="md:col-span-2 mt-4">
              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold shadow-md transition"
              >
                Guardar Cambios
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCoach;
