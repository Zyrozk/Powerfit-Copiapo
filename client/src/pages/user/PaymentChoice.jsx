import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

const PaymentChoice = () => {
  const loc = useLocation();
  const navigate = useNavigate();
  const clase = loc.state?.clase;
  const userId = localStorage.getItem('userId');

  const [membresia, setMembresia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [option, setOption] = useState('membresia'); // 'membresia' or 'efectivo'

  useEffect(() => {
    const fetchMembresia = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`http://127.0.0.1:8000/membresia-activa/${userId}/`);
        const data = await res.json();
        setMembresia(data.activa ? data : null);
        if (!data.activa) setOption('efectivo');
      } catch (e) {
        console.error('Error comprobando membresía', e);
      }
    };
    fetchMembresia();
  }, [userId]);

  if (!clase) return <p className="p-6">No hay clase seleccionada.</p>;

  const handleConfirm = async () => {
    if (!userId) {
      alert('Debes iniciar sesión para reservar');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      let payload = { clase: clase.id, usuario: Number(userId) };
      if (option === 'membresia') payload.usar_membresia = true;
      if (option === 'efectivo') payload.pagar_efectivo = true;

      const res = await fetch('http://127.0.0.1:8000/reservar-clase/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.mensaje || 'Reservado correctamente');
        navigate('/user/history');
      } else {
        alert(data.error || JSON.stringify(data));
      }
    } catch (e) {
      alert('Error de red al procesar la reserva');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">Confirmar reserva</h2>

        <p className="mb-2"><strong>Clase:</strong> {clase.tipo}</p>
        <p className="mb-4"><strong>Día/Horario:</strong> {clase.dia} • {clase.horario}</p>

        {membresia ? (
          <div className="mb-4">
            <p className="text-sm text-gray-600">Tienes una membresía activa: <strong>{membresia.plan_nombre}</strong> ({membresia.plan_clases} clases restantes)</p>
            <div className="mt-3 flex gap-3">
              <label className="flex items-center gap-2">
                <input type="radio" name="payOption" checked={option==='membresia'} onChange={()=>setOption('membresia')} /> Usar membresía
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="payOption" checked={option==='efectivo'} onChange={()=>setOption('efectivo')} /> Pagar clase (3.500 CLP)
              </label>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-sm text-gray-600">No tienes membresía activa. Puedes pagar solo esta clase.</p>
            <div className="mt-3">
              <label className="flex items-center gap-2">
                <input type="radio" name="payOption" checked={option==='efectivo'} onChange={()=>setOption('efectivo')} /> Pagar clase (3.500 CLP)
              </label>
            </div>
          </div>
        )}

        {option === 'efectivo' && (
          <div className="mb-4">
            <p className="text-sm text-gray-700">Total a pagar: <strong>3.500 CLP</strong></p>
            <p className="text-xs text-gray-500">Método disponible: Efectivo</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="secondary" onClick={()=>navigate('/user/classes')}>Cancelar</Button>
          <Button variant="primary" onClick={handleConfirm} className="flex-1" disabled={loading}>{loading? 'Procesando...': 'Confirmar'}</Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentChoice;
