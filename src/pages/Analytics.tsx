import { useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSensorStore } from '../store/store';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

type TimeRange = '7d' | '30d' | '90d';

export default function Analytics() {
  const { sensors } = useSensorStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  type HistoricalPoint = { date: string; temperature: number; humidity: number; soilMoisture: number };

  const generateHistoricalData = (): HistoricalPoint[] => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data: HistoricalPoint[] = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
        temperature: 20 + Math.random() * 10,
        humidity: 40 + Math.random() * 30,
        soilMoisture: 30 + Math.random() * 30,
      });
    }
    return data;
  };

  const historicalData: HistoricalPoint[] = generateHistoricalData();

 
  const fields: string[] = ['all', ...Array.from(new Set(sensors.map(s => (s.location || s.fieldId || '') as string)))];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics</h1>
            <p className="text-gray-600">Analyse des tendances et comparaisons historiques</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Période
                </label>
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="7d">7 derniers jours</option>
                  <option value="30d">30 derniers jours</option>
                  <option value="90d">90 derniers jours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zone
                </label>
                <select 
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {fields.map(field => (
                    <option key={field} value={field}>
                      {field === 'all' ? 'Toutes les zones' : field}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="space-y-6">
            {/* Temperature Trend */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                🌡️ Évolution de la Température
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Température (°C)"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-red-50 rounded">
                  <p className="text-sm text-gray-600">Max</p>
                  <p className="text-2xl font-bold text-red-600">
                    {Math.max(...historicalData.map(d => d.temperature)).toFixed(1)}°C
                  </p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded">
                  <p className="text-sm text-gray-600">Min</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.min(...historicalData.map(d => d.temperature)).toFixed(1)}°C
                  </p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <p className="text-sm text-gray-600">Moyenne</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(historicalData.reduce((sum, d) => sum + d.temperature, 0) / historicalData.length).toFixed(1)}°C
                  </p>
                </div>
              </div>
            </div>

            {/* Humidity Trend */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                💧 Évolution de l'Humidité
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="#06b6d4" 
                    fill="#06b6d4" 
                    fillOpacity={0.3}
                    name="Humidité (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Soil Moisture Trend */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                🌱 Évolution de l'Humidité du Sol
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="soilMoisture" 
                    stroke="#22c55e" 
                    fill="#22c55e" 
                    fillOpacity={0.3}
                    name="Humidité du Sol (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <p className="text-sm text-yellow-700">
                  ⚠️ <strong>Recommandation:</strong> L'humidité du sol est en dessous du seuil optimal (40%). 
                  Envisagez d'augmenter l'irrigation dans les prochaines 24 heures.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}