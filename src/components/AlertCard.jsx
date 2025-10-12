import React from 'react';
import { useSensorStore } from '../store/store';
import { AlertTriangle, Info, Bell } from 'lucide-react';

export default function AlertCard({ alert }) {
  const { resolveAlert } = useSensorStore();

  const severityConfig = {
    critical: {
      icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      badgeColor: 'bg-red-600',
    },
    warning: {
      icon: <Bell className="w-6 h-6 text-yellow-600" />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700',
      badgeColor: 'bg-yellow-500',
    },
    info: {
      icon: <Info className="w-6 h-6 text-blue-600" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      badgeColor: 'bg-blue-600',
    },
  };

  const config = severityConfig[alert.severity] || severityConfig.info;

  const handleResolve = () => {
    if (window.confirm('Marquer cette alerte comme résolue ?')) {
      const alertId = alert.id || alert.alertId;
      if (alertId) {
        resolveAlert(alertId);
      }
    }
  };

  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 shadow-sm`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-md shadow-sm">{config.icon}</div>
          <div>
            <h3 className={`font-bold ${config.textColor}`}>
              {alert.type || alert.alertType || 'Alerte'}
            </h3>
            <p className="text-xs text-gray-600">{alert.sensorId || 'N/A'}</p>
          </div>
        </div>
        <span className={`${config.badgeColor} text-white px-2 py-1 rounded text-xs font-bold uppercase`}>
          {alert.severity || 'info'}
        </span>
      </div>

      {/* Message */}
      <p className="text-sm text-gray-700 mb-3">
        {alert.message || 'Seuil dépassé'}
      </p>

      {/* Values */}
      {alert.value && (
        <div className="bg-white bg-opacity-50 rounded p-2 mb-3 text-sm">
          <span className="font-semibold">Valeur actuelle:</span> {alert.value}
          {alert.threshold && <span className="text-gray-600"> (seuil: {alert.threshold})</span>}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-600">
          {new Date(alert.timestamp || Date.now()).toLocaleString('fr-FR')}
        </span>
        <button
          onClick={handleResolve}
          className="bg-white hover:bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-medium transition"
          aria-label={`Resolve alert ${alert.id || ''}`}
        >
          ✓ Résoudre
        </button>
      </div>
    </div>
  );
}