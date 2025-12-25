import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const History = () => {
  // Estado para controlar qué pestaña está activa ('classes' o 'payments')
  const [activeTab, setActiveTab] = useState('classes');

  // Estados reales: cargaremos desde el backend
  const [classHistory, setClassHistory] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(false);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;

    const fetchClasses = async () => {
      setLoadingClasses(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/mis-reservas/${userId}/`);
        if (!res.ok) throw new Error('Error al cargar reservas');
        const data = await res.json();

        const mapped = data.map((r) => ({
          id: r.id,
          title: r.tipo,
          date: `${r.dia} - ${r.horario}`,
          reservedDate: r.reserved_at ? new Date(r.reserved_at).toLocaleString('es-CL') : null,
          status: (function mapEstado(e){
            if(!e) return 'reservada';
            const lower = e.toString().toLowerCase();
            if(lower.includes('reserv')) return 'reservada';
            if(lower.includes('presen')) return 'asistida';
            if(lower.includes('ausen') || lower.includes('ausente')) return 'no_asistida';
            if(lower.includes('cancel') || lower.includes('anul')) return 'cancelada';
            return lower;
          })(r.estado)
        }));

        setClassHistory(mapped);
      } catch (error) {
        console.error('Error obteniendo reservas:', error);
      } finally {
        setLoadingClasses(false);
      }
    };

    const fetchPayments = async () => {
      setLoadingPayments(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/mis-pagos/${userId}/`);
        if (!res.ok) throw new Error('Error al cargar pagos');
        const data = await res.json();

        const mapped = data.map((p) => ({
          id: p.id,
          amount: p.monto,
          description: `${p.tipo} - ${p.metodo}`,
          date: p.fecha ? `${new Date(p.fecha).toLocaleDateString('es-CL')} ${p.hora ? p.hora : ''}` : null,
          status: (function mapPago(e){
            if(!e) return 'pendiente';
            const lower = e.toString().toLowerCase();
            if(lower.includes('realiz') || lower.includes('pag')) return 'pagado';
            if(lower.includes('pend')) return 'pendiente';
            if(lower.includes('anul') || lower.includes('no')) return 'anulado';
            return lower;
          })(p.estado)
        }));

        setPaymentHistory(mapped);
      } catch (error) {
        console.error('Error obteniendo pagos:', error);
      } finally {
        setLoadingPayments(false);
      }
    };

    fetchClasses();
    fetchPayments();
  }, [userId]);

  // Función auxiliar para formatear dinero
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  };

  // Función para obtener el color y texto del estado (Clases)
  const getClassStatusBadge = (status) => {
    switch (status) {
      case 'reservada':
        return <span className="flex items-center gap-1 text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full"><Clock size={12}/> Reservada</span>;
      case 'asistida':
        return <span className="flex items-center gap-1 text-xs font-bold bg-green-50 text-green-600 px-3 py-1 rounded-full"><CheckCircle size={12}/> Asistida</span>;
      case 'no_asistida':
        return <span className="flex items-center gap-1 text-xs font-bold bg-red-50 text-red-600 px-3 py-1 rounded-full"><XCircle size={12}/> No Asistida</span>;
      case 'cancelada':
        return <span className="flex items-center gap-1 text-xs font-bold bg-gray-50 text-gray-600 px-3 py-1 rounded-full"><XCircle size={12}/> Cancelada</span>;
      default:
        return null;
    }
  };

  // Función para obtener el color y texto del estado (Pagos)
  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'pendiente':
        return <span className="flex items-center gap-1 text-xs font-bold bg-orange-50 text-orange-600 px-3 py-1 rounded-full"><AlertCircle size={12}/> Pendiente</span>;
      case 'pagado':
        return <span className="flex items-center gap-1 text-xs font-bold bg-green-50 text-green-600 px-3 py-1 rounded-full"><CheckCircle size={12}/> Pagado</span>;
      case 'anulado':
        return <span className="flex items-center gap-1 text-xs font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full"><XCircle size={12}/> Anulado</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Botón Volver */}
        <div className="mb-8">
          <Link to="/user/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-green-500 font-medium transition-colors w-fit">
            <ArrowLeft size={20} />
            Volver al Menú
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Historial</h1>
          <p className="text-gray-500">Historial de clases y pagos</p>
        </div>

        {/* --- CONTROLES DE PESTAÑAS (TABS) --- */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 mb-8 max-w-md mx-auto">
          <button 
            onClick={() => setActiveTab('classes')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2
              ${activeTab === 'classes' ? 'bg-green-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Calendar size={16} /> Clases
          </button>
          <button 
            onClick={() => setActiveTab('payments')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2
              ${activeTab === 'payments' ? 'bg-green-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <DollarSign size={16} /> Pagos
          </button>
        </div>

        {/* --- CONTENIDO CONDICIONAL --- */}
        <div className="space-y-4">
          
          {/* VISTA 1: CLASES */}
          {activeTab === 'classes' && (
            <div className="animate-fade-in space-y-4">
              {loadingClasses ? (
                <p className="text-center text-gray-500 py-6">Cargando historial de clases...</p>
              ) : classHistory.length === 0 ? (
                <p className="text-center text-gray-500 py-6">No tienes reservas todavía.</p>
              ) : (
                classHistory.map((item) => (
                  <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="text-green-500" size={18} />
                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">{item.date}</p>
                      <p className="text-xs text-gray-400 ml-6 mt-1">Reservado: {item.reservedDate}</p>
                    </div>
                    <div>
                      {getClassStatusBadge(item.status)}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* VISTA 2: PAGOS */}
          {activeTab === 'payments' && (
            <div className="animate-fade-in space-y-4">
              {loadingPayments ? (
                <p className="text-center text-gray-500 py-6">Cargando historial de pagos...</p>
              ) : paymentHistory.length === 0 ? (
                <p className="text-center text-gray-500 py-6">No tienes pagos registrados.</p>
              ) : (
                paymentHistory.map((item) => (
                  <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl font-bold text-gray-900">{formatPrice(item.amount)}</span>
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-xs text-gray-400 mt-1">Fecha: {item.date}</p>
                    </div>
                    <div>
                      {getPaymentStatusBadge(item.status)}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default History;