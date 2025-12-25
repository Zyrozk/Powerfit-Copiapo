import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { ArrowLeft } from "lucide-react";
import Button from "../../components/common/Button";

const AttendanceQR = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [clase, setClase] = useState(null);

  // 🔹 Validar que venga la clase desde ManageAttendance
  useEffect(() => {
    if (state && state.clase) {
      setClase(state.clase);
    }
  }, [state]);

  // 🔹 Si alguien entra directo a la URL sin clase
  if (!clase) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <p className="text-gray-500 mb-4">
          No hay una clase seleccionada para generar el QR.
        </p>
        <Button onClick={() => navigate("/coach/asistencia")}>
          Volver a Asistencia
        </Button>
      </div>
    );
  }

  // 🔹 URL REAL que contendrá el QR
  const qrValue = `http://127.0.0.1:8000/asistencia/qr/${clase.id}/`;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-8 text-center">

        {/* Volver */}
        <button
          onClick={() => navigate("/coach/asistencia")}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6"
        >
          <ArrowLeft size={20} />
          Volver a Asistencia
        </button>

        {/* Título */}
        <h1 className="text-2xl font-bold mb-2">
          Escanea el código para registrar asistencia
        </h1>

        {/* Info de la clase */}
        <p className="text-gray-500 mb-6">
          {clase.tipo} · {clase.horario}
          {clase.fecha ? ` · ${clase.fecha}` : ""}
        </p>

        {/* 🔳 QR REAL */}
        <div className="flex justify-center mb-6">
          <QRCodeCanvas
            value={qrValue}
            size={220}
            bgColor="#ffffff"
            fgColor="#16a34a" // Verde PowerFit
            level="H"
          />
        </div>

        <p className="text-sm text-gray-500 mb-6">
          QR activo solo para esta clase
        </p>

        <Button
          variant="secondary"
          onClick={() => navigate("/coach/asistencia")}
        >
          Cerrar QR
        </Button>
      </div>
    </div>
  );
};

export default AttendanceQR;
