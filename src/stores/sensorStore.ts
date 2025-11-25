// src/stores/sensorStore.ts

import { create } from 'zustand';
import { type SensorReading,  type Alert, type SensorState } from '@/types/sensor';
import { fetchSensorData, fetchAlerts } from '@/services/api';

interface SensorStore extends SensorState {
  fetchData: () => Promise<void>;
  startPolling: (interval?: number) => void;
  stopPolling: () => void;
  clearError: () => void;
}

let pollingInterval: NodeJS.Timeout | null = null;

export const useSensorStore = create<SensorStore>((set, get) => ({
  // Initial state
  readings: [],
  latestReading: null,
  alerts: [],
  isLoading: false,
  error: null,
  lastUpdated: null,

  // Fetch data from API
  fetchData: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Fetch sensor readings and alerts in parallel
      const [readings, alerts] = await Promise.all([
        fetchSensorData(),
        fetchAlerts()
      ]);

      // DEBUG: Log API response structure
      console.log('API Response - readings type:', typeof readings);
      console.log('API Response - is array:', Array.isArray(readings));
      console.log('API Response - readings:', readings);

      // Ensure readings is an array
      const readingsArray = Array.isArray(readings) ? readings : [];

      set({
        readings: readingsArray,
        latestReading: readingsArray[0] || null,
        alerts: Array.isArray(alerts) ? alerts : [],
        isLoading: false,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Fetch error:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch data',
        isLoading: false
      });
    }
  },

  // Start polling (default: 30 seconds)
  startPolling: (interval = 30000) => {
    const { fetchData } = get();
    
    // Fetch immediately
    fetchData();
    
    // Clear existing interval
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    
    // Start new polling interval
    pollingInterval = setInterval(() => {
      fetchData();
    }, interval);
  },

  // Stop polling
  stopPolling: () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  },

  // Clear error
  clearError: () => set({ error: null })
}));