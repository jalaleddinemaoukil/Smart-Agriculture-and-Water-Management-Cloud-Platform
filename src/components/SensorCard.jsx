import React from 'react';
import { Droplet, Thermometer, Wind, MapPin } from 'lucide-react';

function SensorCard({ name, temperature, humidity, soilMoisture, status, location }) {
  const statusColors = {
    ok: 'bg-green-100 text-green-800 border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    critical: 'bg-red-100 text-red-800 border-red-300'
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${statusColors[status] || statusColors.ok}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-500 flex items-center mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            {location}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <Thermometer className="w-6 h-6 mx-auto text-orange-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">{temperature}°C</p>
          <p className="text-xs text-gray-500">Temperature</p>
        </div>
        <div className="text-center">
          <Droplet className="w-6 h-6 mx-auto text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">{humidity}%</p>
          <p className="text-xs text-gray-500">Humidity</p>
        </div>
        <div className="text-center">
          <Wind className="w-6 h-6 mx-auto text-green-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">{soilMoisture}%</p>
          <p className="text-xs text-gray-500">Soil</p>
        </div>
      </div>
    </div>
  );
}

export default SensorCard;