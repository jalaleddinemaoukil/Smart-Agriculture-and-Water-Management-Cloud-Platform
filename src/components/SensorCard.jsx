import React from 'react';
import { useSensorStore } from '../store/store';

export default function SensorCard({ sensor }) {
  const { selectSensor } = useSensorStore();

  // Déterminer le statut de santé du capteur
  const getHealthStatus = () => {
    const temp = sensor.temperature || 0;
    const humidity = sensor.humidity || 0;
    const soil = sensor.soilMoisture || 0;

    if (temp > 35 || humidity < 30 || soil < 20) {
      return { status: 'critical', color: 'red', text: 'Critique' };
    } else if (temp > 30 || humidity < 40 || soil < 30) {
      return { status: 'warning', color: 'yellow', text: 'Attention' };
    }
    return { status: 'good', color: 'green', text: 'Bon état' };
  };

  const health = getHealthStatus();

  const statusColors = {
    red: 'bg-red-100 border-red-500',
    yellow: 'bg-yellow-100 border-yellow-500',
    green: 'bg-green-100 border-green-500',
  };

  const badgeColors = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
  };

  const handleClick = () => {
    const sensorId = sensor.id || sensor.sensorId;
    if (sensorId) {
      selectSensor(sensorId);
    }
  };

  return (
    <div 
      className={`${statusColors[health.color]} rounded-lg p-4 border-2 cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1`}
      onClick={handleClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">
            {sensor.name || sensor.sensorId || 'Capteur'}
          </h3>
          <p className="text-sm text-gray-600">{sensor.location || 'Zone inconnue'}</p>
        </div>
        <span className={`${badgeColors[health.color]} text-white px-2 py-1 rounded-full text-xs font-bold`}>
          {health.text}
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">🌡️ Temp</p>
          <p className="text-xl font-bold text-gray-800">
            {sensor.temperature?.toFixed(1) || 0}°
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">💧 Humid</p>
          <p className="text-xl font-bold text-gray-800">
            {sensor.humidity?.toFixed(1) || 0}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">🌱 Sol</p>
          <p className="text-xl font-bold text-gray-800">
            {sensor.soilMoisture?.toFixed(1) || 0}%
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-300">
        <span>📍 {sensor.sensorId || sensor.id || 'N/A'}</span>
        <span>🕐 {new Date(sensor.timestamp || Date.now()).toLocaleTimeString('fr-FR')}</span>
      </div>
    </div>
  );
}