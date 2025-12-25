import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Loader } from 'lucide-react';
import Button from '../../components/common/Button';

const PaymentMethod = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('transferencia');
  const [selectedFile, setSelectedFile] = useState(null); 
  const [errors, setErrors] = useState({});
  
  const { plan } = location.state || {};
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!plan || !userId) navigate("/user/memberships");
  }, [plan, userId, navigate]);

  if (!plan) return null;

  // Manejar selección de archivo
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setErrors({ file: 'Solo se permiten archivos de imagen (JPG, PNG, GIF) o PDF.' });
        setSelectedFile(null);
        return;
      }
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ file: 'El archivo no puede superar los 5MB.' });
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setErrors({}); // Limpiar errores
    }
  };

  const handleFinalizePurchase = async () => {
    // Validación: Solo pedimos archivo si es transferencia
    if (paymentMethod === 'transferencia' && !selectedFile) {
      setErrors({ file: 'Por favor, adjunta el comprobante de pago.' });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("usuario", userId);
    formData.append("plan_nombre", plan.name);
    formData.append("plan_clases", plan.classes);
    formData.append("plan_precio", plan.price);
    
    // Solo adjuntamos comprobante si existe (caso transferencia)
    if (selectedFile) {
      formData.append("comprobante", selectedFile);
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/comprar-membresia/", {
        method: "POST",
        body: formData, 
      });

      if (res.ok) {
        alert("Solicitud enviada con éxito. Espere la confirmación del administrador.");
        navigate("/user/dashboard"); 
      } else {
        const data = await res.json();
        alert("Error: " + (data.error || "No se pudo procesar"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  // Formateador de precio para mostrarlo en el título
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Botón Volver */}
      <div className="absolute top-24 left-4 md:left-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-green-500 font-medium">
          <ArrowLeft size={20} /> Volver
        </button>
      </div>

      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Método de Pago</h1>
        <p className="text-gray-500 text-sm mb-6">
            {plan.name} - {plan.classes} clases - <span className="font-semibold text-gray-700">{formatPrice(plan.price)}</span>
        </p>
        
        {/* OPCIÓN 1: Transferencia Bancaria */}
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer mb-2">
            <input 
              type="radio" 
              className="text-green-500 focus:ring-green-500 scale-125"
              checked={paymentMethod === 'transferencia'}
              onChange={() => setPaymentMethod('transferencia')}
            />
            <span className="font-semibold text-gray-700">Transferencia Bancaria</span>
          </label>

          {paymentMethod === 'transferencia' && (
            <div className="ml-6 animate-fade-in">
                {/* Datos Bancarios (Basado en la imagen) */}
                <div className="p-4 border border-gray-200 rounded-xl bg-white text-sm space-y-2 mb-4 shadow-sm">
                    <p><span className="font-bold text-gray-800">RUT:</span> 20.564.756-2</p>
                    <p><span className="font-bold text-gray-800">Banco:</span> Banco Estado</p>
                    <p><span className="font-bold text-gray-800">Tipo de Cuenta:</span> Cuenta Vista/Rut</p>
                    <p><span className="font-bold text-gray-800">Número de Cuenta:</span> 20.564.756</p>
                    <p><span className="font-bold text-gray-800">Nombre:</span> Valeria López</p>
                    <p><span className="font-bold text-gray-800">Correo:</span> powerfit@copiapo.cl</p>
                </div>
              
                {/* Subida de Archivo */}
                <div className="pt-2">
                    <label className="block font-bold mb-2 text-gray-700 text-sm">Comprobante de Pago *</label>
                    <div className={`relative border-2 border-dashed rounded-lg p-4 text-center hover:border-green-500 transition-colors bg-gray-50 ${errors.file ? 'border-red-500' : 'border-gray-300'}`}>
                    <input 
                        type="file" 
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center text-gray-500">
                        <Upload size={24} className="mb-2 text-green-500"/>
                        <span className="text-sm font-medium text-gray-600">
                        {selectedFile ? selectedFile.name : "Seleccionar archivo"}
                        </span>
                        {!selectedFile && <span className="text-xs text-gray-400 mt-1">Sin archivos seleccionados</span>}
                    </div>
                    </div>
                    {errors.file && <p className="text-red-500 text-xs mt-2">{errors.file}</p>}
                    <p className="text-xs text-gray-400 mt-2 text-center">
                        Tu membresía se activará una vez que el pago sea verificado. Máximo 5MB, formatos: JPG, PNG, GIF, PDF.
                    </p>
                </div>
            </div>
          )}
        </div>

        {/* OPCIÓN 2: Efectivo */}
        <div className="mb-8">
            <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input 
                type="radio" 
                className="text-green-500 focus:ring-green-500 scale-125"
                checked={paymentMethod === 'efectivo'}
                onChange={() => setPaymentMethod('efectivo')}
                />
                <span className="font-semibold text-gray-700">Efectivo</span>
            </label>

            {paymentMethod === 'efectivo' && (
                <div className="ml-6 animate-fade-in">
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 text-sm text-center">
                        Acércate a nuestra sucursal para pagar y hacer efectiva tu membresía
                    </div>
                </div>
            )}
        </div>

        <Button variant="primary" className="w-full py-3" onClick={handleFinalizePurchase} disabled={loading}>
          {loading ? <Loader className="animate-spin mx-auto"/> : "Confirmar"}
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethod;