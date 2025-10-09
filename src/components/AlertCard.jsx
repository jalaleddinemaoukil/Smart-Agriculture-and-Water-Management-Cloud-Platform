import React from 'react';
import { useSensorStore } from '../store/store';

export default function AlertCard({ alert }) {
  const { resolveAlert } = useSensorStore();

  const severityConfig = {
    critical: {
      icon: '🚨',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-500',
      textColor: 'text-red-700',
      badgeColor: 'bg-red-500',
    },
    warning: {
      icon: '⚠️',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-700',
      badgeColor: 'bg-yellow-500',
    },
    info: {
      icon: 'ℹ️',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-700',
      badgeColor: 'bg-blue-500',
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
    <div className={`${config.bgColor} border-2 ${config.borderColor} rounded-lg p-4`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{config.icon}</span>
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
        >
          ✓ Résoudre
        </button>
      </div>
    </div>
  );
}