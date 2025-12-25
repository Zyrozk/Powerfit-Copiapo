import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react'; // Importamos CheckCircle
import Button from '../../components/common/Button';

const Register = () => {
  const navigate = useNavigate();
  
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: ''
  });

  // Estado para errores de validación
  const [errors, setErrors] = useState({});

  // Estado para controlar la visibilidad del modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  // Función de validación
  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio.';
    } else if (formData.nombre.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres.';
    }

    // Validar apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio.';
    } else if (formData.apellido.length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres.';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido.';
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos una letra minúscula, una mayúscula y un número.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submit = async () => {
      try {
        const payload = {
          nombre: formData.nombre.trim(),
          apellido: formData.apellido.trim(),
          correo: formData.email.trim().toLowerCase(),
          password: formData.password
        };

        const res = await fetch('http://127.0.0.1:8000/registro/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          // CAMBIO: En lugar de navegar inmediatamente, mostramos el modal
          setShowSuccessModal(true);
        } else {
          const err = await res.json();
          console.error('Error al registrar:', err);
          
          // Manejar errores específicos del backend
          if (err.correo && err.correo[0] === "Este correo electrónico ya está registrado.") {
            setErrors({ email: 'Este correo electrónico ya está registrado.' });
          } else if (err.password) {
            setErrors({ password: err.password[0] });
          } else {
            alert('Error al registrar: ' + (err.detail || JSON.stringify(err)));
          }
        }
      } catch (error) {
        console.error('Network error:', error);
        alert('Error de red al contactar el servidor.');
      }
    };

    submit();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative">
      
      {/* Botón Volver */}
      <div className="absolute top-24 left-4 md:left-8">
        <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-green-500 font-medium transition-colors">
          <ArrowLeft size={20} />
          Volver al menú
        </Link>
      </div>

      {/* Tarjeta de Registro */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 border border-gray-100">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Powerfit Copiapó</h1>
          <p className="text-gray-500 text-sm mt-1">Accede a tu cuenta o crea una nueva</p>
        </div>

        {/* Pestañas */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
          <Link to="/login" className="flex-1 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 text-center">
            Iniciar Sesión
          </Link>
          <button className="flex-1 py-2 text-sm font-semibold bg-white text-gray-900 rounded-md shadow-sm">
            Registrarse
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
            <input 
              type="text" 
              name="nombre"
              placeholder="Juan"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Apellido</label>
            <input 
              type="text" 
              name="apellido"
              placeholder="Pérez"
              value={formData.apellido}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none ${errors.apellido ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Correo electrónico o teléfono</label>
            <input 
              type="email" 
              name="email"
              placeholder="tu@correo.com"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            <p className="text-xs text-gray-500 mt-1">Debe tener al menos 8 caracteres, con mayúscula, minúscula y número.</p>
          </div>

          <Button type="submit" variant="primary" className="w-full py-3 mt-2">
            Crear Cuenta
          </Button>

        </form>
      </div>

      {/* --- MODAL DE ÉXITO (PANTALLA EMERGENTE) --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-100 transform transition-all scale-100">
            
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Registro Exitoso!
            </h3>
            
            <p className="text-gray-500 mb-8">
              Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión para acceder a la plataforma.
            </p>
            
            <Button 
              variant="primary" 
              className="w-full"
              onClick={() => navigate('/login')}
            >
              Ir a Iniciar Sesión
            </Button>
            
          </div>
        </div>
      )}

    </div>
  );
};

export default Register;