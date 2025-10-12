import React, { useState } from 'react';
import { useSensorStore } from '../store/store';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Download, Calendar, FileText } from 'lucide-react';

export default function Reports() {
  const { sensors, stats } = useSensorStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedFields, setSelectedFields] = useState([]);
  const [reportType, setReportType] = useState('summary');

  // Get unique fields (locations)
  const fields = [...new Set(sensors.map(s => s.location || s.fieldId || 'Unknown'))];

  const handleFieldToggle = (field) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const handleExport = (format) => {
    const filteredSensors = sensors.filter(s => 
      selectedFields.length === 0 || 
      selectedFields.includes(s.location) || 
      selectedFields.includes(s.fieldId)
    );

    const reportData = {
      generatedAt: new Date().toISOString(),
      period: { start: startDate, end: endDate },
      fields: selectedFields.length > 0 ? selectedFields : ['all'],
      reportType,
      stats,
      sensors: filteredSensors,
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sawmp_report_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } else if (format === 'csv') {
      const headers = ['Sensor ID', 'Field', 'Temperature', 'Humidity', 'Soil Moisture', 'Timestamp', 'Status'];
      const rows = reportData.sensors.map(s => [
        s.sensorId || s.id,
        s.location || s.fieldId || 'Unknown',
        s.temperature ?? '',
        s.humidity ?? '',
        s.soilMoisture ?? '',
        s.timestamp ? new Date(s.timestamp).toLocaleString() : '',
        s.status || '',
      ]);
      const csv = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sawmp_report_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  const renderStatusBadge = (status) => {
    if (!status) return <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">N/A</span>;
    if (status === 'critical' || status === 'warning') {
      return <span className={`px-2 py-1 rounded text-xs ${status === 'critical' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{status}</span>;
    }
    return <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">{status}</span>;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">📄 Rapports</h1>
            <p className="text-gray-600">Générez et exportez des rapports personnalisés</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Configuration Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Configuration</h2>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Période
                  </label>
                  <input 
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                    placeholder="Date de début"
                  />
                  <input 
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Date de fin"
                  />
                </div>

                {/* Report Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline w-4 h-4 mr-1" />
                    Type de rapport
                  </label>
                  <select 
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="summary">Résumé général</option>
                    <option value="detailed">Détaillé</option>
                    <option value="alerts">Alertes seulement</option>
                    <option value="comparison">Comparaison zones</option>
                  </select>
                </div>

                {/* Field Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zones à inclure
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {fields.map(field => (
                      <label key={field} className="flex items-center">
                        <input 
                          type="checkbox"
                          checked={selectedFields.includes(field)}
                          onChange={() => handleFieldToggle(field)}
                          className="mr-2"
                        />
                        <span className="text-sm">{field}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Export Buttons */}
                <div className="space-y-2">
                  <button 
                    onClick={() => handleExport('csv')}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Exporter CSV
                  </button>
                  <button 
                    onClick={() => handleExport('json')}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Exporter JSON
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Aperçu du rapport</h2>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Capteurs</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalSensors}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Alertes</p>
                    <p className="text-2xl font-bold text-red-600">{stats.activeAlerts}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Temp. Moy.</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.avgTemperature}°C</p>
                  </div>
                  <div className="bg-cyan-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Humid. Moy.</p>
                    <p className="text-2xl font-bold text-cyan-600">{stats.avgHumidity}%</p>
                  </div>
                </div>

                {/* Sample Data Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Capteur</th>
                        <th className="px-4 py-2 text-left">Zone</th>
                        <th className="px-4 py-2 text-left">Temp.</th>
                        <th className="px-4 py-2 text-left">Humid.</th>
                        <th className="px-4 py-2 text-left">Sol</th>
                        <th className="px-4 py-2 text-left">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sensors.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-6 text-center text-gray-500">Aucun capteur disponible</td>
                        </tr>
                      ) : (
                        sensors.slice(0, 50).map((sensor, i) => (
                          <tr key={sensor.id || sensor.sensorId || i} className="border-t">
                            <td className="px-4 py-2">{sensor.sensorId || sensor.id}</td>
                            <td className="px-4 py-2">{sensor.location || sensor.fieldId || '—'}</td>
                            <td className="px-4 py-2">{typeof sensor.temperature === 'number' ? `${sensor.temperature.toFixed(1)}°C` : '—'}</td>
                            <td className="px-4 py-2">{typeof sensor.humidity === 'number' ? `${sensor.humidity.toFixed(1)}%` : '—'}</td>
                            <td className="px-4 py-2">{typeof sensor.soilMoisture === 'number' ? `${sensor.soilMoisture.toFixed(1)}%` : '—'}</td>
                            <td className="px-4 py-2">{renderStatusBadge(sensor.status)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}