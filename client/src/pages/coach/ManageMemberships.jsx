import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, AlertCircle, X, Eye } from 'lucide-react';
import Button from '../../components/common/Button';

const ManageMemberships = () => {
  const [memberships, setMemberships] = useState([]);
  const [activeTab, setActiveTab] = useState('Pendientes');
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchMemberships = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/coach/membresias/");
      const data = await res.json();
      setMemberships(data);
    } catch (error) {
      console.error("Error cargando membresías:", error);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const handleApprove = async (id) => {
    if(!window.confirm("¿Aprobar esta membresía?")) return;
    const res = await fetch(`http://127.0.0.1:8000/coach/aprobar-membresia/${id}/`, { method: "POST" });
    if (res.ok) {
      alert("Membresía aprobada");
      fetchMemberships();
    }
  };

  const handleReject = async (id) => {
    if(!window.confirm("¿Rechazar y eliminar esta solicitud?")) return;
    const res = await fetch(`http://127.0.0.1:8000/membresia/eliminar/${id}/`, { method: "DELETE" });
    if (res.ok) {
      setMemberships(prev => prev.filter(m => m.id !== id));
    }
  };

  const filteredList = memberships.filter(m => {
    if (activeTab === 'Todas') return true;
    const statusToMatch = activeTab.endsWith('s') ? activeTab.slice(0, -1) : activeTab;
    return m.status === statusToMatch;
  });

  const tabs = ['Pendientes', 'Activas', 'Todas'];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Link to="/coach/panel" className="flex items-center gap-2 text-gray-600 mb-6">
        <ArrowLeft size={20} /> Volver al Panel
      </Link>

      <h1 className="text-3xl font-bold text-center mb-8">Gestión de Membresías</h1>

      <div className="flex justify-center gap-4 mb-8">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full font-semibold ${
              activeTab === tab ? 'bg-green-500 text-white' : 'bg-white text-gray-600 border'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto space-y-4">
        {filteredList.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border flex flex-col md:flex-row gap-4">

            <div className="flex-1">
              <h3 className="text-lg font-bold">{item.user || `Usuario #${item.usuario}`}</h3>
              <p className="text-gray-500">{item.plan_nombre}</p>

              <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                <div>
                  <span className="block text-xs text-gray-400 font-bold">Precio</span>
                  ${item.plan_precio}
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-bold">Clases</span>
                  {item.plan_clases}
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-bold">Inicio</span>
                  {item.start_date}
                </div>
              </div>

              {/* 🔔 AVISO DE VENCIMIENTO */}
              {item.end_date && (() => {
                const hoy = new Date();
                const fin = new Date(item.end_date);
                const diff = Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24));

                if (diff < 0) {
                  return <p className="mt-3 text-sm font-semibold text-red-600">⛔ Membresía vencida</p>;
                }

                if (diff <= 3) {
                  return <p className="mt-3 text-sm font-semibold text-yellow-600">⚠️ Vence en {diff} día{diff !== 1 && "s"}</p>;
                }

                return null;
              })()}
            </div>

            {item.status === 'Pendiente' && (
              <div className="flex gap-3">
                <button onClick={() => handleReject(item.id)} className="border border-red-500 text-red-500 px-4 py-2 rounded-full">
                  Rechazar
                </button>
                <Button onClick={() => handleApprove(item.id)}>Aprobar</Button>
              </div>
            )}
          </div>
        ))}

        {filteredList.length === 0 && (
          <p className="text-center text-gray-400 py-10">No hay membresías.</p>
        )}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Comprobante" className="max-w-xl rounded-xl" />
        </div>
      )}
    </div>
  );
};

export default ManageMemberships;
