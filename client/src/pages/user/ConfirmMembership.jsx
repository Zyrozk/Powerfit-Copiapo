import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '../../components/common/Button';

const ConfirmMembership = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. Recuperamos los datos del plan y el usuario
  const { plan } = location.state || {};
  const userId = localStorage.getItem("userId");

  // 2. Validaciones de seguridad (Redirección si faltan datos)
  useEffect(() => {
    if (!plan) {
      navigate("/user/memberships");
    }
    if (!userId) {
      alert("Debes iniciar sesión para realizar una compra.");
      navigate("/login");
    }
  }, [plan, userId, navigate]);

  // Evitar renderizado si se está redirigiendo
  if (!plan) return null;

  // 3. Formateador de dinero
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  };

  // 4. Lógica de Redirección (NO compra, solo avanza al pago)
  const handleContinueToPayment = () => {
    // Pasamos el objeto 'plan' a la siguiente pantalla
    navigate("/user/memberships/payment-method", { state: { plan: plan } });
  };

  // 5. Renderizado
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      
      {/* Botón Volver */}
      <div className="absolute top-24 left-4 md:left-8">
        <Link to="/user/memberships" className="flex items-center gap-2 text-gray-600 hover:text-green-500 font-medium transition-colors">
          <ArrowLeft size={20} />
          Volver a planes
        </Link>
      </div>

      {/* Tarjeta de Confirmación */}
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-8 border border-gray-100">
        
        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-2">
          <CheckCircle className="text-green-500" size={28} />
          <h1 className="text-2xl font-bold text-gray-900">Confirmar Membresía</h1>
        </div>
        <p className="text-gray-500 text-sm mb-8 ml-10">
          Por favor verifica que toda la información sea correcta
        </p>

        {/* Detalle del Plan (Contenedor gris) */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-2 gap-y-6">
            
            {/* Nombre del Plan */}
            <div>
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                Membresía
              </span>
              <span className="text-lg font-bold text-gray-900">
                {plan.name}
              </span>
            </div>

            {/* Cantidad de Clases */}
            <div>
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                Clases
              </span>
              <span className="text-lg font-bold text-gray-900">
                {plan.classes} clases
              </span>
            </div>

            {/* Precio */}
            <div className="col-span-2 border-t border-gray-200 pt-4 mt-2">
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                Precio Total
              </span>
              <span className="text-3xl font-extrabold text-green-600">
                {formatPrice(plan.price)}
              </span>
            </div>

          </div>
        </div>

        {/* Botón de Acción */}
        <Button 
          variant="primary" 
          className="w-full py-4 text-lg flex justify-center items-center gap-2"
          onClick={handleContinueToPayment}
        >
          Está todo correcto, continuar al pago
        </Button>

      </div>
    </div>
  );
};

export default ConfirmMembership;