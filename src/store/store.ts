import { create } from 'zustand';
import { sensorAPI } from '@/services/api';
import type { Sensor, Alert, Report, Stats } from '@/types/sensor.types';

interface SensorStore {
  // State
  sensors: Sensor[];
  realtimeData: Sensor[];
  alerts: Alert[];
  reports: Report[];
  selectedSensor: Sensor | null;
  stats: Stats;
  loading: boolean;
  error: string | null;
  lastUpdate: string | null;

  // Actions
  fetchSensors: () => Promise<void>;
  fetchRealtime: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  fetchReports: () => Promise<void>;
  resolveAlert: (alertId: string) => Promise<void>;
  selectSensor: (sensorId: string) => Promise<void>;
  calculateStats: () => void;
  refreshAll: () => Promise<void>;
  clearError: () => void;
}

export const useSensorStore = create<SensorStore>((set, get) => ({
  // Initial state
  sensors: [],
  realtimeData: [],
  alerts: [],
  reports: [],
  selectedSensor: null,
  stats: {
    totalSensors: 0,
    activeAlerts: 0,
    avgTemperature: 0,
    avgHumidity: 0,
    avgSoilMoisture: 0,
  },
  loading: false,
  error: null,
  lastUpdate: null,

  // Actions
  fetchSensors: async () => {
    set({ loading: true, error: null });
    try {
      const data = await sensorAPI.getSensors();
      console.log('Sensors data received:', data);
      
      const sensorsArray: Sensor[] = Array.isArray(data) ? data.map(sensor => ({
        ...sensor,
        id: sensor.id || sensor.sensorId,
        sensorId: sensor.sensorId || sensor.id,
        temperature: sensor.temperature ?? 0,
        humidity: sensor.humidity ?? 0,
        soilMoisture: sensor.soilMoisture ?? 0,
        location: sensor.location || 'Zone inconnue',
        timestamp: sensor.timestamp || new Date().toISOString(),
      })) : [];

      set({ 
        sensors: sensorsArray,
        loading: false,
        lastUpdate: new Date().toISOString()
      });
      
      get().calculateStats();
    } catch (error) {
      set({ 
        error: (error as Error).message || 'Failed to fetch sensors', 
        loading: false 
      });
    }
  },

  fetchRealtime: async () => {
    try {
      const data = await sensorAPI.getRealtime();
      console.log('Realtime data received:', data);
      
      set({ 
        realtimeData: Array.isArray(data) ? data : [],
        lastUpdate: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching realtime data:', error);
      set({ error: (error as Error).message });
    }
  },

  fetchAlerts: async () => {
    try {
      const data = await sensorAPI.getAlerts();
      console.log('🚨 Alerts data received:', data);
      
      const alertsArray: Alert[] = Array.isArray(data) ? data : [];
      set({ 
        alerts: alertsArray,
        stats: { ...get().stats, activeAlerts: alertsArray.length }
      });
    } catch (error) {
      console.error('Error fetching alerts:', error);
      set({ error: (error as Error).message });
    }
  },

  fetchReports: async () => {
    try {
      const data = await sensorAPI.getReports();
      console.log('Reports data received:', data);

      const reportsArray: Report[] = Array.isArray(data) ? data : [];
      set({ reports: reportsArray });
    } catch (error) {
      console.error('Error fetching reports:', error);
      set({ error: (error as Error).message });
    }
  },

  resolveAlert: async (alertId: string) => {
    try {
      await sensorAPI.resolveAlert(alertId);
      console.log('Alert resolved:', alertId);
      
      const updatedAlerts = get().alerts.filter(alert => alert.id !== alertId);
      set({ 
        alerts: updatedAlerts,
        stats: { ...get().stats, activeAlerts: updatedAlerts.length }
      });
    } catch (error) {
      console.error('Error resolving alert:', error);
      set({ error: (error as Error).message });
    }
  },

  selectSensor: async (sensorId: string) => {
    set({ loading: true });
    try {
      const data = await sensorAPI.getSensorById(sensorId);
      console.log('📍 Sensor details received:', data);
      
      set({ selectedSensor: data, loading: false });
    } catch (error) {
      console.error('Error fetching sensor details:', error);
      set({ error: (error as Error).message, loading: false });
    }
  },

  calculateStats: () => {
    const { sensors, alerts } = get();
    
    if (sensors.length === 0) {
      set({ stats: {
        totalSensors: 0,
        activeAlerts: alerts.length,
        avgTemperature: 0,
        avgHumidity: 0,
        avgSoilMoisture: 0,
      }});
      return;
    }

    const avgTemp = sensors.reduce((sum, s) => sum + (s.temperature || 0), 0) / sensors.length;
    const avgHum = sensors.reduce((sum, s) => sum + (s.humidity || 0), 0) / sensors.length;
    const avgSoil = sensors.reduce((sum, s) => sum + (s.soilMoisture || 0), 0) / sensors.length;

    set({
      stats: {
        totalSensors: sensors.length,
        activeAlerts: alerts.length,
        avgTemperature: parseFloat(avgTemp.toFixed(1)),
        avgHumidity: parseFloat(avgHum.toFixed(1)),
        avgSoilMoisture: parseFloat(avgSoil.toFixed(1)),
      }
    });
  },

  refreshAll: async () => {
    console.log('Refreshing all data...');
    set({ loading: true });
    
    try {
      await Promise.all([
        get().fetchSensors(),
        get().fetchRealtime(),
        get().fetchAlerts(),
        get().fetchReports(),
      ]);
      set({ loading: false });
      console.log('✅ All data refreshed successfully');
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      console.error('❌ Error refreshing data:', error);
    }
  },

  clearError: () => set({ error: null }),
}));