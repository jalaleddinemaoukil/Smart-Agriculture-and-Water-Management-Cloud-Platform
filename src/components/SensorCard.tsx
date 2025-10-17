import { useSensorStore } from '../store/store';
import { Thermometer, Droplet } from 'lucide-react';
import type { Sensor } from '../types/sensor.types';

interface SensorCardProps {
  sensor: Sensor;
}

export default function SensorCard({ sensor }: SensorCardProps) {
  const { selectSensor } = useSensorStore();

  const getHealthStatus = () => {
    const temp = sensor.temperature ?? 0;
    const humidity = sensor.humidity ?? 0;
    const soil = sensor.soilMoisture ?? 0;

    if (temp > 35 || humidity < 30 || soil < 20) {
      return { status: 'critical' as const, color: 'red' as const, text: 'Critical' };
    } else if (temp > 30 || humidity < 40 || soil < 30) {
      return { status: 'warning' as const, color: 'yellow' as const, text: 'Warning' };
    }
    return { status: 'good' as const, color: 'green' as const, text: 'Optimal' };
  };

  const health = getHealthStatus();

  const statusColors = {
    red: 'bg-red-50 border-red-100',
    yellow: 'bg-yellow-50 border-yellow-100',
    green: 'bg-green-50 border-green-100',
  };

  const badgeColors = {
    red: 'bg-red-600',
    yellow: 'bg-yellow-500',
    green: 'bg-green-600',
  };

  const handleClick = () => {
    const sensorId = sensor.id || sensor.sensorId;
    if (sensorId) {
      selectSensor(sensorId);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`rounded-lg p-2 border ${statusColors[health.color]} cursor-pointer hover:shadow-lg transition transform hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-start gap-3">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {sensor.name || sensor.sensorId || 'Sensor'}
            </h3>
            <p className="text-sm text-gray-600">
              {sensor.location || 'Unknown Zone'}
            </p>
          </div>
        </div>

        <span className={`${badgeColors[health.color]} text-white px-2 py-1 rounded-full text-xs font-semibold`}>
          {health.text}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3 text-center">
        <div>
          <p className="text-xs text-gray-600 mb-1 flex items-center justify-center gap-2">
            <Thermometer className="w-4 h-4"/> Temp
          </p>
          <p className="text-xl font-bold text-gray-800">
            {typeof sensor.temperature === 'number' ? `${sensor.temperature.toFixed(1)}°` : '—'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1 flex items-center justify-center gap-2">
            <Droplet className="w-4 h-4"/> Humid
          </p>
          <p className="text-xl font-bold text-gray-800">
            {typeof sensor.humidity === 'number' ? `${sensor.humidity.toFixed(1)}%` : '—'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2s4 4 4 7a4 4 0 01-4 4 4 4 0 01-4-4c0-3 4-7 4-7z" />
              <path d="M2 22s4-6 10-6 10 6 10 6" />
            </svg>
            Soil
          </p>
          <p className="text-xl font-bold text-gray-800">
            {typeof sensor.soilMoisture === 'number' ? `${sensor.soilMoisture.toFixed(1)}%` : '—'}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-200">
        <span>📍 {sensor.sensorId || sensor.id || 'N/A'}</span>
        <span>🕐 {new Date(sensor.timestamp || Date.now()).toLocaleTimeString('fr-FR')}</span>
      </div>
    </div>
  );
}