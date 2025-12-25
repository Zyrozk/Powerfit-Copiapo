import { useLocation, Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Ticket, CheckCircle } from 'lucide-react';
import Button from '../../components/common/Button';

const ClassBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Recibimos los datos de la clase seleccionada
  const { schedule, classTitle } = location.state || {};

  // Validación de seguridad
  if (!schedule) {
    return <Navigate to="/user/classes" />;
  }

  // Simulación de datos
  const userMembership = {
    active: true,
    remainingSpots: 12
  };

  // --- AQUÍ ESTÁ EL CAMBIO ---
  const handleUseMembership = () => {
    // 1. (Opcional) Mostrar un mensaje rápido de éxito
    alert(`¡Reserva confirmada para ${classTitle}! Se ha descontado 1 cupo.`);
    
    // 2. Redirigir directamente al Dashboard (Inicio)
    navigate('/user/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg">
        
        {/* Botón Volver */}
        <div className="mb-6">
          <Link to="/user/classes" className="flex items-center gap-2 text-gray-600 hover:text-green-500 font-medium transition-colors w-fit">
            <ArrowLeft size={20} />
            Volver a clases
          </Link>
        </div>

        {/* Tarjeta Principal */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Método de Pago</h1>
          <p className="text-gray-500 text-sm mb-6">
            {classTitle} - {schedule.day} {schedule.time}
          </p>

          <p className="text-gray-700 font-medium mb-4">
            Tienes una membresía activa. ¿Cómo deseas reservar esta clase?
          </p>

          <div className="space-y-4">
            
            {/* Opción 1: Usar Membresía */}
            <div className="border-2 border-green-500 bg-green-50/30 rounded-xl p-4 cursor-pointer relative hover:shadow-md transition-shadow">
              <div className="absolute top-4 right-4 text-green-600">
                <CheckCircle size={24} />
              </div>
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-green-100 p-2 rounded-lg text-green-600">
                  <Ticket size={24} />
                </div>
                <h3 className="font-bold text-gray-900">Usar Membresía</h3>
              </div>
              <p className="text-sm text-gray-600 ml-14">
                Usar uno de tus {userMembership.remainingSpots} cupos disponibles.
              </p>
              
              {/* El botón ejecuta la función que redirige al Dashboard */}
              <Button 
                variant="primary" 
                className="w-full mt-4"
                onClick={handleUseMembership}
              >
                Confirmar con Membresía
              </Button>
            </div>

            {/* Opción 2: Pagar Clase Individual (Solo visual por ahora) */}
            <div className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors opacity-75">
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-gray-100 p-2 rounded-lg text-gray-500">
                  <CreditCard size={24} />
                </div>
                <h3 className="font-bold text-gray-900">Pagar Solo Esta Clase</h3>
              </div>
              <p className="text-sm text-gray-600 ml-14 mb-4">
                Pagar $3.500 por esta clase individual.
              </p>
              <button className="w-full py-2 border border-gray-300 rounded-full text-gray-500 text-sm font-semibold hover:bg-gray-50">
                Ir a Pagar
              </button>
            </div>

          </div>

          <div className="mt-6 text-center">
            <Link to="/user/memberships" className="text-sm text-green-600 font-semibold hover:underline">
              Ver Opciones de Membresías
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ClassBooking;