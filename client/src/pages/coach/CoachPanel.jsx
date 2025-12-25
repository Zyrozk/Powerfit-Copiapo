// src/pages/coach/CoachPanel.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Users,
  Calendar,
  User,
  DollarSign,
  LogOut,
  BarChart3,
  QrCode
} from "lucide-react";
import DashboardCard from "../../components/common/DashboardCard";

const CoachPanel = () => {
  const navigate = useNavigate();

  const nombre = localStorage.getItem("userName") || "";
  const apellido = localStorage.getItem("userApellido") || "";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-gray-50 px-8 py-6">

      {/* Cerrar sesión */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-500 hover:bg-red-50 font-medium rounded-lg transition"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>

      {/* Bienvenida */}
      <h1 className="text-3xl font-bold text-gray-900">
        Bienvenid@ {nombre} {apellido}
      </h1>
      <p className="text-gray-500 mb-10">Panel de Coach PowerFit</p>

      {/* Tarjetas */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <DashboardCard
          Icon={CreditCard}
          title="Membresías"
          subtitle="Ver membresías activas"
          buttonText="Ver Membresías"
          to="/coach/manage-memberships"
        />

        <DashboardCard
          Icon={Users}
          title="Usuarios"
          subtitle="Ver información de usuarios"
          buttonText="Ver Usuarios"
          to="/coach/manage-users"
        />

        <DashboardCard
          Icon={Calendar}
          title="Horario"
          subtitle="Ver horarios"
          buttonText="Ver Horario"
          to="/coach/schedule"
        />

        <DashboardCard
          Icon={Users}
          title="Asistencia"
          subtitle="Control de asistencia diaria"
          buttonText="Ver Clases de Hoy"
          to="/coach/asistencia"
        />

        <DashboardCard
          Icon={User}
          title="Coaches"
          subtitle="Ver información de coaches"
          buttonText="Ver Coaches"
          to="/coach/coaches"
        />

        <DashboardCard
          Icon={DollarSign}
          title="Pagos"
          subtitle="Ver y exportar historial de pagos"
          buttonText="Ver Pagos"
          to="/coach/payments"
        />

        <DashboardCard
          Icon={BarChart3}
          title="Estadísticas"
          subtitle="Indicadores de gestión del gimnasio"
          buttonText="Ver Estadísticas"
          to="/coach/statistics"
        />

        {/* 🆕 CONTROL DE ASISTENCIA QR */}
        <DashboardCard
          Icon={QrCode}
          title="Control de Asistencia"
          subtitle="Registrar asistencia con código QR"
          buttonText="Abrir QR"
          to="/coach/attendance-qr"
        />

      </section>
    </main>
  );
};

export default CoachPanel;
