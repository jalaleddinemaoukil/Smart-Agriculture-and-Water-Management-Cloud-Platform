import React, { useState, useEffect } from 'react';
import { Thermometer, Droplet, MapPin, AlertTriangle } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SensorCard from './components/SensorCard';
import AlertCard from './components/AlertCard';
import StatsCard from './components/StatsCard';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sensors, setSensors] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for now - you'll replace with real API calls
  useEffect(() => {
    setTimeout(() => {
      setSensors([
        {
          id: 1,
          name: 'Sensor Zone A1',
          temperature: 24.5,
          humidity: 65,
          soilMoisture: 42,
          status: 'ok',
          location: 'North Field'
        },
        {
          id: 2,
          name: 'Sensor Zone A2',
          temperature: 28.3,
          humidity: 45,
          soilMoisture: 28,
          status: 'warning',
          location: 'South Field'
        },
        {
          id: 3,
          name: 'Sensor Zone B1',
          temperature: 32.1,
          humidity: 38,
          soilMoisture: 15,
          status: 'critical',
          location: 'East Field'
        },
        {
          id: 4,
          name: 'Sensor Zone B2',
          temperature: 23.8,
          humidity: 70,
          soilMoisture: 55,
          status: 'ok',
          location: 'West Field'
        }
      ]);

      setAlerts([
        {
          id: 1,
          type: 'Low Soil Moisture',
          message: 'Sensor Zone B1 reports soil moisture at 15% - irrigation needed',
          severity: 'high',
          timestamp: '2 minutes ago'
        },
        {
          id: 2,
          type: 'High Temperature',
          message: 'Temperature in Zone A2 exceeded 28°C threshold',
          severity: 'medium',
          timestamp: '15 minutes ago'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const handleResolveAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatsCard 
              title="Active Sensors" 
              value="12" 
              unit="online"
              icon={MapPin}
              trend={0}
              color="text-blue-500"
            />
            <StatsCard 
              title="Avg Temperature" 
              value="27.2" 
              unit="°C"
              icon={Thermometer}
              trend={2.3}
              color="text-orange-500"
            />
            <StatsCard 
              title="Avg Humidity" 
              value="54.5" 
              unit="%"
              icon={Droplet}
              trend={-1.2}
              color="text-blue-400"
            />
            <StatsCard 
              title="Active Alerts" 
              value={alerts.length.toString()} 
              unit="warnings"
              icon={AlertTriangle}
              trend={-5}
              color="text-red-500"
            />
          </div>

          {/* Alerts Section */}
          {alerts.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Active Alerts</h2>
              <div className="bg-white rounded-lg shadow-md p-4">
                {alerts.map(alert => (
                  <AlertCard 
                    key={alert.id}
                    {...alert}
                    onResolve={() => handleResolveAlert(alert.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sensors Grid */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Sensor Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {sensors.map(sensor => (
                <SensorCard key={sensor.id} {...sensor} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;