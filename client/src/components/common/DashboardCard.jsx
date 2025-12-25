// src/components/common/DashboardCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardCard = ({ Icon, title, subtitle, buttonText, to }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col justify-between">
      <div>
        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
          {Icon && <Icon className="w-6 h-6 text-green-600" />}
        </div>

        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>

      {buttonText && to && (
        <button
          type="button"
          onClick={() => navigate(to)}
          className="mt-6 py-2.5 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold transition"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default DashboardCard;
