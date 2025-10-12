import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Save, AlertTriangle, Bell, Sliders } from 'lucide-react';

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [thresholds, setThresholds] = useState({
    soilMoisture: { critical: 25, warning: 35, optimal: 40 },
    temperature: { criticalLow: 10, criticalHigh: 38, warningLow: 15, warningHigh: 32 },
    humidity: { critical: 25, warning: 35, optimal: 45 },
    ph: { criticalLow: 5.0, criticalHigh: 8.0, optimalLow: 6.0, optimalHigh: 7.0 },
    waterLevel: { critical: 15, warning: 25, optimal: 40 }
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    criticalOnly: false
  });

  const handleThresholdChange = (metric, level, value) => {
    setThresholds(prev => ({
      ...prev,
      [metric]: { ...prev[metric], [level]: parseFloat(value) }
    }));
  };

  const handleSave = () => {
    alert('Paramètres sauvegardés!');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
            <p className="text-gray-600">Configurez les seuils d'alerte et les préférences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alert Thresholds */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sliders className="w-5 h-5" />
                Seuils d'Alerte
              </h2>

              {/* Soil Moisture */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">🌱 Humidité du Sol (%)</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Critical (&lt;)</label>
                    <input 
                      type="number"
                      value={thresholds.soilMoisture.critical}
                      onChange={(e) => handleThresholdChange('soilMoisture', 'critical', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Warning (&lt;)</label>
                    <input 
                      type="number"
                      value={thresholds.soilMoisture.warning}
                      onChange={(e) => handleThresholdChange('soilMoisture', 'warning', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Optimal (&gt;)</label>
                    <input 
                      type="number"
                      value={thresholds.soilMoisture.optimal}
                      onChange={(e) => handleThresholdChange('soilMoisture', 'optimal', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Temperature */}
              <div className="mb-6 p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">🌡️ Température (°C)</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Critique Bas (&lt;)</label>
                    <input 
                      type="number"
                      value={thresholds.temperature.criticalLow}
                      onChange={(e) => handleThresholdChange('temperature', 'criticalLow', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Attention Bas (&lt;)</label>
                    <input 
                      type="number"
                      value={thresholds.temperature.warningLow}
                      onChange={(e) => handleThresholdChange('temperature', 'warningLow', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Attention Haut (&gt;)</label>
                    <input 
                      type="number"
                      value={thresholds.temperature.warningHigh}
                      onChange={(e) => handleThresholdChange('temperature', 'warningHigh', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Critique Haut (&gt;)</label>
                    <input 
                      type="number"
                      value={thresholds.temperature.criticalHigh}
                      onChange={(e) => handleThresholdChange('temperature', 'criticalHigh', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Humidity */}
              <div className="mb-6 p-4 bg-cyan-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">💧 Humidité Air (%)</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Critique (&lt;)</label>
                    <input 
                      type="number"
                      value={thresholds.humidity.critical}
                      onChange={(e) => handleThresholdChange('humidity', 'critical', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Attention (&lt;)</label>
                    <input 
                      type="number"
                      value={thresholds.humidity.warning}
                      onChange={(e) => handleThresholdChange('humidity', 'warning', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Optimal (&gt;)</label>
                    <input 
                      type="number"
                      value={thresholds.humidity.optimal}
                      onChange={(e) => handleThresholdChange('humidity', 'optimal', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* pH Level */}
              <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">⚗️ Niveau pH</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Critique Bas (&lt;)</label>
                    <input 
                      type="number"
                      step="0.1"
                      value={thresholds.ph.criticalLow}
                      onChange={(e) => handleThresholdChange('ph', 'criticalLow', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Optimal Min</label>
                    <input 
                      type="number"
                      step="0.1"
                      value={thresholds.ph.optimalLow}
                      onChange={(e) => handleThresholdChange('ph', 'optimalLow', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Optimal Max</label>
                    <input 
                      type="number"
                      step="0.1"
                      value={thresholds.ph.optimalHigh}
                      onChange={(e) => handleThresholdChange('ph', 'optimalHigh', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Critique Haut (&gt;)</label>
                    <input 
                      type="number"
                      step="0.1"
                      value={thresholds.ph.criticalHigh}
                      onChange={(e) => handleThresholdChange('ph', 'criticalHigh', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications & Other Settings */}
            <div className="space-y-6">
              {/* Notification Preferences */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </h2>
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Email</span>
                    <input 
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                      className="w-5 h-5"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">SMS</span>
                    <input 
                      type="checkbox"
                      checked={notifications.sms}
                      onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                      className="w-5 h-5"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Push (Navigateur)</span>
                    <input 
                      type="checkbox"
                      checked={notifications.push}
                      onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                      className="w-5 h-5"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Alertes critiques uniquement</span>
                    <input 
                      type="checkbox"
                      checked={notifications.criticalOnly}
                      onChange={(e) => setNotifications({...notifications, criticalOnly: e.target.checked})}
                      className="w-5 h-5"
                    />
                  </label>
                </div>
              </div>

              {/* Warning Info */}
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-1">
                      Impact des Seuils
                    </h3>
                    <p className="text-sm text-yellow-700">
                      Les seuils configurés affectent directement la génération d'alertes. 
                      Des seuils trop stricts peuvent générer trop d'alertes, tandis que des 
                      seuils trop larges peuvent manquer des problèmes critiques.
                    </p>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button 
                onClick={handleSave}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-semibold"
              >
                <Save className="w-5 h-5" />
                Sauvegarder les Paramètres
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}