import { useEffect, useState } from 'react';
import { useSensorStore } from '../store/store';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SensorCard from '../components/SensorCard';
import AlertCard from '../components/AlertCard';
import StatsCard from '../components/StatsCard';
import { Satellite, AlertTriangle, Thermometer, Droplet } from 'lucide-react';

export default function Dashboard() {
  const { sensors, alerts, stats, loading, error, fetchRealtime, fetchAlerts, refreshAll, clearError } = useSensorStore();
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchRealtime();
      fetchAlerts();
    }, 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchRealtime, fetchAlerts]);

  if (loading && sensors.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading data...</p>
          <p className="text-sm text-gray-500 mt-2">Connecting to sensors...</p>
        </div>
      </div>
    );
  }

  if (error && sensors.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-500 text-6xl mb-4 text-center"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Connection Error</h2>
          <p className="text-gray-600 mb-4 text-center">{error}</p>
          <div className="flex gap-2">
            <button
              onClick={refreshAll}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Retry
            </button>
            <button
              onClick={clearError}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Ignore
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Last Update: {new Date().toLocaleTimeString('en-US')}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2 rounded-lg font-medium transition ${autoRefresh
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
              >
                {autoRefresh ? '✓ Auto-refresh ON' : '○ Auto-refresh OFF'}
              </button>
              <button
                onClick={refreshAll}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatsCard
              title="Total Sensors"
              value={stats.totalSensors}
              icon={<Satellite size={28} />}   
              color="green"
              subtitle="Active sensors"
            />
            <StatsCard
              title="Active Alerts"
              value={stats.activeAlerts}
              icon={<AlertTriangle size={28} />}   
              color="red"
              subtitle="Require attention"
            />
            <StatsCard
              title="Average Temperature"
              value={`${stats.avgTemperature}°C`}
              icon={<Thermometer size={28} />}   
              color="blue"
              subtitle="All zones"
            />
            <StatsCard
              title="Average Humidity"
              value={`${stats.avgHumidity}%`}
              icon={<Droplet size={28} />}   
              color="cyan"
              subtitle="All zones"
            />

          </div>

          {alerts.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                Active Alerts ({alerts.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {alerts.slice(0, 6).map((alert, index) => (
                  <AlertCard key={alert.id || index} alert={alert} />
                ))}
              </div>
              {alerts.length > 6 && (
                <div className="text-center mt-4">
                  <button className="text-blue-600 hover:underline font-medium">
                    See all Alerts ({alerts.length})
                  </button>
                </div>
              )}
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              Sensors Network ({sensors.length})
            </h2>

            {sensors.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Sensor Captured</h3>
                <p className="text-gray-500">Sensors will appear here once connected</p>
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
          </div>
        </main>
      </div>
    </div>
  );
}
