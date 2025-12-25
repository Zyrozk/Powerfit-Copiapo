import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Activity, HeartPulse } from 'lucide-react';

const Profile = () => {
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const userApellido = localStorage.getItem("userApellido");
  const userEmail = localStorage.getItem("userEmail");

  const [physicalData, setPhysicalData] = useState({
    weight: "",
    height: ""
  });

  const [history, setHistory] = useState([]);

  // Calcular IMC
  const calculateIMC = () => {
    if (!physicalData.weight || !physicalData.height) return null;

    const weight = parseFloat(physicalData.weight);
    const heightMeters = parseFloat(physicalData.height) / 100;

    if (heightMeters <= 0) return null;

    return (weight / (heightMeters * heightMeters)).toFixed(1);
  };

  const imc = calculateIMC();

  // Guardar datos físicos en el backend
  const handleSave = async () => {
    if (!imc) {
      alert("Por favor ingresa valores válidos de peso y estatura.");
      return;
    }

    const payload = {
      usuario: Number(userId),
      peso: physicalData.weight,
      altura: physicalData.height,
      imc: imc
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/datosFisico/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registro guardado con éxito.");
        loadHistory(); // recargar historial sin recargar página
      } else {
        console.error(data);
        alert("Error al guardar: " + JSON.stringify(data));
      }
    } catch (error) {
      console.error(error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  // Cargar historial
  const loadHistory = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/datosFisicos/${userId}/`);
      const data = await res.json();

      if (res.ok) {
        setHistory(data);
      }
    } catch (error) {
      console.error("Error cargando historial:", error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* NAV */}
        <div className="flex items-center gap-2 mb-4">
          <Link 
            to="/user/dashboard" 
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 font-medium"
          >
            <ArrowLeft size={20} />
            Volver al Menú
          </Link>
        </div>

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center text-gray-900">Mi Ficha Personal</h1>
        <p className="text-center text-gray-500 mb-10">
          Información personal y médica
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* DATOS PERSONALES */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="text-green-600" size={22} />
              <h2 className="text-lg font-bold text-gray-800">Datos Personales</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Nombre</label>
                <input 
                  type="text" 
                  value={userName} 
                  disabled
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Apellido</label>
                <input 
                  type="text" 
                  value={userApellido} 
                  disabled
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Correo electrónico</label>
                <input 
                  type="email" 
                  value={userEmail} 
                  disabled
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* DATOS FÍSICOS */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="text-green-600" size={22} />
              <h2 className="text-lg font-bold text-gray-800">Datos Físicos</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Peso (kg)</label>
                <input
                  type="number"
                  placeholder="Ej: 60"
                  value={physicalData.weight}
                  onChange={(e) => setPhysicalData({...physicalData, weight: e.target.value})}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Altura (cm)</label>
                <input
                  type="number"
                  placeholder="Ej: 160"
                  value={physicalData.height}
                  onChange={(e) => setPhysicalData({...physicalData, height: e.target.value})}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

        </div>

        {/* IMC */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-10">
          <div className="flex items-center gap-3 mb-4">
            <HeartPulse size={22} className="text-green-600" />
            <h2 className="text-lg font-bold text-gray-800">Índice de Masa Corporal (IMC)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* RESULT */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <p className="text-gray-600 mb-2">Tu IMC es</p>
              <p className="text-4xl font-bold text-green-600">{imc || "--"}</p>

              {imc && (
                <p className="mt-1 text-sm font-semibold text-green-700">
                  {imc < 18.5 ? "Bajo peso" :
                   imc < 25 ? "Peso normal" :
                   imc < 30 ? "Sobrepeso" :
                   "Obesidad"}
                </p>
              )}

              <button 
                onClick={handleSave}
                className="mt-5 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-full shadow"
              >
                Guardar Registro
              </button>
            </div>

            {/* RANGOS */}
            <div className="text-sm text-gray-700">

              <p className="font-bold mb-4">Rangos de IMC:</p>

              <div className="space-y-3">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span>Bajo peso</span>
                  <span className="text-blue-600">&lt; 18.5</span>
                </div>

                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span>Peso normal</span>
                  <span className="text-green-600">18.5 - 24.9</span>
                </div>

                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span>Sobrepeso</span>
                  <span className="text-orange-500">25 - 29.9</span>
                </div>

                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span>Obesidad</span>
                  <span className="text-red-600">&ge; 30</span>
                </div>
              </div>

              <p className="text-gray-400 text-xs mt-6">
                Última actualización: {new Date().toLocaleDateString()}
              </p>

            </div>

          </div>
        </div>

        {/* HISTORIAL */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-10">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Historial de Registros</h2>

          {history.length === 0 ? (
            <p className="text-gray-500 text-sm">Aún no tienes registros guardados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-300 text-gray-600">
                  <tr>
                    <th className="py-2">Fecha</th>
                    <th className="py-2">Peso (kg)</th>
                    <th className="py-2">Altura (cm)</th>
                    <th className="py-2">IMC</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2">{item.fecha}</td>
                      <td className="py-2">{item.peso}</td>
                      <td className="py-2">{item.altura}</td>
                      <td className="py-2 font-semibold">{item.imc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
