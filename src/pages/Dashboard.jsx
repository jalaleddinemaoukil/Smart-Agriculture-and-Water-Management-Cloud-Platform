import React, { useEffect, useState } from 'react';
import { useSensorStore } from '../store/store';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SensorCard from '../components/SensorCard';
import AlertCard from '../components/AlertCard';
import StatsCard from '../components/StatsCard';

export default function Dashboard() {
  const { 
    sensors, 
    alerts, 
    stats,
    loading, 
    error,
    fetchRealtime,
    fetchAlerts,
    refreshAll,
    clearError,
  } = useSensorStore();

  // Debug logs for state before rendering
  console.log('Dashboard sensors:', sensors);
  console.log('Dashboard stats:', stats);
  console.log('Dashboard alerts:', alerts);

  const [autoRefresh, setAutoRefresh] = useState(true);

  // Chargement initial des données
  useEffect(() => {
    console.log('🚀 Dashboard mounted - Loading data...');
    refreshAll();
  }, [refreshAll]);

  // Auto-refresh toutes les 30 secondes
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing data...');
      fetchRealtime();
      fetchAlerts();
    }, 5000); // 30 secondes

    return () => clearInterval(interval);
  }, [autoRefresh, fetchRealtime, fetchAlerts]);

  if (loading && sensors.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Chargement des données...</p>
          <p className="text-sm text-gray-500 mt-2">Connexion aux capteurs en cours</p>
        </div>
      </div>
    );
  }

  if (error && sensors.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-500 text-6xl mb-4 text-center">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Erreur de connexion</h2>
          <p className="text-gray-600 mb-4 text-center">{error}</p>
          <div className="flex gap-2">
            <button 
              onClick={refreshAll}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Réessayer
            </button>
            <button 
              onClick={clearError}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Ignorer
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
              <h1 className="text-3xl font-bold text-gray-800">Tableau de bord SAWMP</h1>
              <p className="text-gray-600 mt-1">
                Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  autoRefresh 
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
                <span className={loading ? 'animate-spin' : ''}>🔄</span>
                Actualiser
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatsCard 
              title="Total Capteurs" 
              value={stats.totalSensors} 
              icon="📡"
              color="blue"
              subtitle="Capteurs actifs"
            />
            <StatsCard 
              title="Alertes Actives" 
              value={stats.activeAlerts} 
              icon="⚠️"
              color="red"
              subtitle="Nécessitent attention"
            />
            <StatsCard 
              title="Température Moyenne" 
              value={`${stats.avgTemperature}°C`}
              icon="🌡️"
              color="orange"
              subtitle="Toutes zones"
            />
            <StatsCard 
              title="Humidité Moyenne" 
              value={`${stats.avgHumidity}%`}
              icon="💧"
              color="cyan"
              subtitle="Toutes zones"
            />
          </div>

          {alerts.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>⚠️</span>
                Alertes Actives ({alerts.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {alerts.slice(0, 6).map((alert, index) => (
                  <AlertCard key={alert.id || index} alert={alert} />
                ))}
              </div>
              {alerts.length > 6 && (
                <div className="text-center mt-4">
                  <button className="text-blue-600 hover:underline font-medium">
                    Voir toutes les alertes ({alerts.length})
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Sensors Grid */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🌾</span>
              Réseau de Capteurs ({sensors.length})
            </h2>
            
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
          </div>
        </main>
      </div>
    </div>
  );
}