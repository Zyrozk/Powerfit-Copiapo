import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';

const CreateCoach = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    biografia: '',
    especialidades: ''
  });

  const [errors, setErrors] = useState({});

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

    // Validar biografia
    if (formData.biografia.length > 250) {
      newErrors.biografia = 'La biografía no puede exceder 250 caracteres.';
    }

    // Validar especialidades
    if (formData.especialidades.length > 50) {
      newErrors.especialidades = 'Las especialidades no pueden exceder 50 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      correo: formData.email.trim().toLowerCase(),
      password: formData.password,
      bibliografia: formData.biografia.trim(),
      especialidad: formData.especialidades.trim()
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/coaches/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Coach creado exitosamente");
        navigate('/coach/coaches');
      } else {
        // Manejar errores específicos del backend
        if (data.correo && data.correo[0] === "Este correo electrónico ya está registrado.") {
          setErrors({ email: 'Este correo electrónico ya está registrado.' });
        } else if (data.password) {
          setErrors({ password: data.password[0] });
        } else {
          alert("Error: " + JSON.stringify(data));
        }
      }
    } catch (error) {
      alert("No se pudo conectar con el servidor");
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        
        {/* Botón Volver */}
        <div className="mb-6">
          <Link to="/coach/coaches" className="flex items-center gap-2 text-gray-600 hover:text-green-500 font-medium transition-colors w-fit">
            <ArrowLeft size={20} />
            Volver a Coaches
          </Link>
        </div>

        {/* Formulario (Card Blanca) */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10">
          
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Crear Nuevo Coach</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Fila 1: Nombre y Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre *</label>
                <input 
                  type="text" 
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Apellido *</label>
                <input 
                  type="text" 
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none ${errors.apellido ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
              </div>
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Correo Electrónico *</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
              <input 
                type="tel" 
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña *</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              <p className="text-xs text-gray-500 mt-1">Debe tener al menos 8 caracteres, con mayúscula, minúscula y número.</p>
            </div>

            {/* Biografía */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Biografía</label>
              <textarea 
                name="biografia"
                rows="4"
                value={formData.biografia}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none resize-none ${errors.biografia ? 'border-red-500' : 'border-gray-300'}`}
              ></textarea>
              {errors.biografia && <p className="text-red-500 text-xs mt-1">{errors.biografia}</p>}
            </div>

            {/* Especialidades */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Especialidades (separadas por coma)</label>
              <input 
                type="text" 
                name="especialidades"
                placeholder="Ej: Baile entretenido, Step, Localizado"
                value={formData.especialidades}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none ${errors.especialidades ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.especialidades && <p className="text-red-500 text-xs mt-1">{errors.especialidades}</p>}
            </div>

            {/* Botón Guardar */}
            <Button variant="primary" type='submit' className="w-full py-3 text-lg mt-4">
              Crear Coach
            </Button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCoach;