import { useState } from 'react';
import { useSensorStore } from '../store/store';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import AlertCard from '../components/AlertCard';

export default function Alerts() {
  const { alerts } = useSensorStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.severity === filter;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Alertes</h1>
            <p className="text-gray-600">Gérez et résolvez les alertes actives</p>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-6">
            {['all', 'critical', 'warning', 'info'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === f 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {f === 'all' ? 'Toutes' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {filteredAlerts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune alerte active</h3>
              <p className="text-gray-500">Tous les systèmes fonctionnent normalement</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAlerts.map((alert, index) => (
                <AlertCard key={alert.id || index} alert={alert} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}