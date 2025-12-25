import { Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import Button from '../../components/common/Button';

const Memberships = () => {
  // Datos de los planes basados en la Figura 11 del documento 
  const plans = [
    {
      id: 1,
      name: "Plan 1",
      price: 15000,
      classes: 10,
      isPopular: false,
      features: ["10 clases al mes", "Acceso a todas las clases", "Válido por 30 días"]
    },
    {
      id: 2,
      name: "Plan 2",
      price: 20000,
      classes: 15,
      isPopular: true, // Este es el que se destaca con borde verde y etiqueta
      features: ["15 clases al mes", "Acceso a todas las clases", "Válido por 30 días"]
    },
    {
      id: 3,
      name: "Plan 3",
      price: 30000,
      classes: 25,
      isPopular: false,
      features: ["25 clases al mes", "Acceso a todas las clases", "Válido por 30 días"]
    }
  ];

  // Función para formatear dinero (CLP)
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Botón Volver (Navegación al Dashboard) */}
        <div className="mb-8">
          <Link to="/user/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-green-500 font-medium transition-colors w-fit">
            <ArrowLeft size={20} />
            Volver al Menú
          </Link>
        </div>

        {/* Encabezado */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Nuestras Membresías
          </h1>
          <p className="text-gray-500">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </div>

        {/* Grilla de Planes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`relative bg-white rounded-2xl p-8 transition-all duration-300 flex flex-col
                ${plan.isPopular 
                  ? 'border-2 border-green-500 shadow-xl scale-105 z-10' // Estilos destacados para Plan 2
                  : 'border border-gray-100 shadow-sm hover:shadow-md'
                }
              `}
            >
              {/* Etiqueta "Más Popular" (Solo si es true) */}
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-sm">
                  Más Popular
                </div>
              )}

              {/* Título y Precio */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {formatPrice(plan.price)}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-2">{plan.classes} clases</p>
              </div>

              {/* Lista de Características */}
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                    <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Envolvemos el botón en un Link que pasa el objeto 'plan' completo al siguiente paso */}
              <Link 
                to="/user/memberships/confirm" 
                state={{ plan: plan }} 
                className="w-full"
              >
                <Button 
                  variant={plan.isPopular ? 'primary' : 'secondary'} 
                  className="w-full justify-center"
                >
                  Elegir esta opción
                </Button>
              </Link>
              
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Memberships;