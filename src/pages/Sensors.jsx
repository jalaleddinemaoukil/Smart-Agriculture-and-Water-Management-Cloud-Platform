import React, { useState } from 'react';
import { useSensorStore } from '../store/store';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SensorCard from '../components/SensorCard';

export default function Sensors() {
  const { sensors } = useSensorStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Sensors</h1>
            <p className="text-gray-600">Detailed view for the sensors.</p>
          </div>

          {sensors.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-6xl mb-4">📡</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun capteur détecté</h3>
              <p className="text-gray-500">Les capteurs apparaîtront ici une fois connectés</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sensors.map((sensor, index) => (
                <SensorCard 
                  key={sensor.id || sensor.sensorId || index} 
                  sensor={sensor}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}