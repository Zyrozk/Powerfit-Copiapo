import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Wallet, Calendar, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';

const MyMembership = () => {
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(true);
  const [membership, setMembership] = useState(null);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchMembership = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/membresia-activa/${userId}/`
        );
        const data = await res.json();

        if (data.activa) {
          setMembership(data);
        } else {
          setMembership(null);
        }
      } catch (error) {
        console.error("Error al obtener membresía:", error);
      }
    };

    const fetchHistorial = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/historial-uso/${userId}/`
        );
        const data = await res.json();
        setHistorial(data);
      } catch (error) {
        console.error("Error cargando historial:", error);
      }
    };

    Promise.all([fetchMembership(), fetchHistorial()]).finally(() =>
      setLoading(false)
    );
  }, [userId]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price);

  if (loading) {
    return <div className="p-6 text-center">Cargando membresía...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">

        {/* Navegación */}
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/user/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-green-500 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Volver al Menú
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mi Membresía</h1>
          <p className="text-gray-500">Detalles de tu plan actual</p>
        </div>

        {/* --- CON PLAN --- */}
        {membership ? (
          <div className="space-y-8 animate-fade-in">

            {/* Datos de la membresía */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-xl text-green-600">
                    <Wallet size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {membership.plan_nombre}
                    </h2>
                    <p className="text-gray-500">
                      {formatPrice(membership.plan_precio)}
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                  Activa
                </span>
              </div>

              <div className="grid grid-cols-2 gap-8 border-t border-b border-gray-100 py-6 mb-6">
                <div>
                  <span className="block text-sm text-gray-500 mb-1">
                    Clases del Plan
                  </span>
                  <span className="text-3xl font-bold text-gray-900">
                    {membership.plan_clases}
                  </span>
                </div>
                <div>
                  <span className="block text-sm text-gray-500 mb-1">
                    Clases restantes
                  </span>
                  <span className="text-3xl font-bold text-green-600">
                    {membership.clases_disponibles}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={16} />
                Inicio: {membership.start_date}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={16} />
                Término: {membership.end_date}
              </div>
            </div>

            {/* Historial de uso */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Historial de Uso
              </h3>

              {historial.length > 0 ? (
                <ul className="space-y-4">
                  {historial.map((h, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {h.tipo}
                        </p>
                        <p className="text-sm text-gray-500">
                          {h.fecha} · {h.horario}
                        </p>
                      </div>

                      <span
                        className={`text-sm font-bold ${
                          h.estado === "Presente"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {h.estado === "Presente"
                          ? "Asistida"
                          : "No asistida"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">
                  Aún no has utilizado tu membresía.
                </p>
              )}
            </div>

          </div>
        ) : (

          /* --- SIN PLAN --- */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center animate-fade-in">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <AlertCircle size={40} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              No tienes una membresía activa
            </h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Adquiere un plan ahora para comenzar a reservar tus clases.
            </p>
            <Link to="/user/memberships">
              <Button variant="primary">
                Ver Membresías Disponibles
              </Button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyMembership;
